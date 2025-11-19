// ================================================
// AUTH OTP (Email code) - Signup/Login tabs + countdown
// ================================================

(function () {
  const OTP_DIALOG_TEMPLATE = `
    <div class="modal-content auth-modal-card">
      <div class="modal-header">
        <div>
          <h2 class="modal-title" id="authModalTitle">Espace membre</h2>
          <p class="modal-subtitle" id="authModalSubtitle">Identifie-toi pour partager ou célébrer un témoignage.</p>
        </div>
        <button class="modal-close" type="button" id="otpCloseBtn">&times;</button>
      </div>

      <div class="tabs-container auth-tabs">
        <button type="button" class="tab-btn active" data-auth-mode="signup">
          Créer un compte
        </button>
        <button type="button" class="tab-btn" data-auth-mode="login">
          Connexion
        </button>
      </div>

      <div class="auth-steps">
        <div id="authStepForm">
          <div class="form-row" id="authNameRow">
            <div class="form-group">
              <label>Prénom</label>
              <input type="text" id="authFirstName" class="form-input" placeholder="Prénom">
            </div>
            <div class="form-group">
              <label>Nom</label>
              <input type="text" id="authLastName" class="form-input" placeholder="Nom">
            </div>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" id="authEmail" class="form-input" placeholder="email@example.com" required>
          </div>

          <div class="form-actions">
            <button type="button" class="cancel-btn" id="otpCancelBtn">Annuler</button>
            <button type="button" class="submit-btn" id="otpStartBtn">Recevoir le code</button>
          </div>
        </div>

        <div id="authStepCode" class="hidden">
          <p class="modal-subtitle" id="otpSummary">
            Un code de 6 chiffres vient d'être envoyé à votre adresse email.
          </p>
          <div class="form-group">
            <label>Code</label>
            <input type="text" id="authCode" maxlength="6" class="form-input code-input" placeholder="000000">
          </div>

          <div class="otp-countdown">
            <span id="otpCountdown">Renvoyer un code dans 01:00</span>
            <button type="button" class="link-btn" id="otpResendBtn" disabled>Renvoyer le code</button>
          </div>

          <div class="form-actions">
            <button type="button" class="cancel-btn" id="otpBackBtn">Modifier l'email</button>
            <button type="button" class="submit-btn" id="otpVerifyBtn">Valider le code</button>
          </div>
        </div>
      </div>
    </div>
  `;

  let currentAuthMode = 'signup';
  let countdownTimer = null;
  let countdownRemaining = 0;

  const AUTH = window.AUTH_OTP || {};
  AUTH.nextAction = AUTH.nextAction || null;
  AUTH.ensureAuthThen = function ensureAuthThen(fn) {
    if (window.STATE && window.STATE.userName) {
      if (typeof fn === 'function') fn();
      return;
    }
    AUTH.nextAction = fn || null;
    showToast('Connectez-vous pour partager votre témoignage', {
      actionText: 'Se connecter',
      onAction: () => openAuthDialogOTP()
    });
    openAuthDialogOTP();
  };
  window.AUTH_OTP = AUTH;

  function getCSRF() {
    const name = 'csrftoken=';
    const parts = document.cookie ? document.cookie.split(';') : [];
    for (let c of parts) {
      const cookie = c.trim();
      if (cookie.indexOf(name) === 0) return cookie.substring(name.length);
    }
    return '';
  }

  async function apiPost(url, data) {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRF()
      },
      credentials: 'same-origin',
      body: JSON.stringify(data || {})
    });
    let json = {};
    try {
      json = await res.json();
    } catch {
      json = {};
    }
    if (!res.ok || json.ok === false) {
      const text = (!json || Object.keys(json).length === 0) ? (await res.text().catch(() => '')) : '';
      const msg = (json && json.error) ? json.error : (text || `Erreur API (HTTP ${res.status})`);
      throw new Error(msg);
    }
    return json;
  }

  async function checkAuth() {
    try {
      const r = await fetch('/auth/status/', { credentials: 'same-origin' });
      const j = await r.json();
      if (j && j.ok && j.user) {
        const name = j.user.first_name
          ? `${j.user.first_name}${j.user.last_name ? ` ${j.user.last_name}` : ''}`
          : (j.user.email || '');
        window.STATE.userName = name;
        window.STATE.userEmail = j.user.email || '';
        localStorage.setItem('bunda21_user', name);
      } else {
        window.STATE.userName = null;
        window.STATE.userEmail = '';
        localStorage.removeItem('bunda21_user');
      }
    } catch (e) {
      window.STATE.userName = null;
      window.STATE.userEmail = '';
      localStorage.removeItem('bunda21_user');
    }
    if (window.MAIN && window.MAIN.renderAuthButton) {
      window.MAIN.renderAuthButton();
      patchAuthButtons();
    }
  }

  async function signOut() {
    try {
      await apiPost('/auth/logout/', {});
    } catch (error) {
      console.warn('logout failed', error);
    }
    window.STATE.userName = null;
    window.STATE.userEmail = '';
    localStorage.removeItem('bunda21_user');
    await checkAuth();
    if (typeof window.showToast === 'function') {
      window.showToast('Déconnexion réussie 🙏', { kind: 'success' });
    }
  }

  function getDialog() {
    let dlg = document.getElementById('otpAuthDialog');
    if (!dlg) {
      dlg = document.createElement('dialog');
      dlg.id = 'otpAuthDialog';
      dlg.className = 'modal auth-modal';
      dlg.innerHTML = OTP_DIALOG_TEMPLATE;
      document.body.appendChild(dlg);
    }
    return dlg;
  }

  function initDialog() {
    const dlg = getDialog();
    if (dlg.dataset.otpInit === '1') return;
    dlg.dataset.otpInit = '1';

    dlg.querySelectorAll('[data-auth-mode]').forEach((btn) => {
      btn.addEventListener('click', () => setAuthMode(btn.dataset.authMode));
    });

    dlg.querySelector('#otpCloseBtn')?.addEventListener('click', () => {
      dlg.close();
      resetAuthDialog();
    });
    dlg.addEventListener('close', resetAuthDialog);

    dlg.querySelector('#otpCancelBtn')?.addEventListener('click', () => {
      dlg.close();
      resetAuthDialog();
    });

    dlg.querySelector('#otpBackBtn')?.addEventListener('click', () => {
      stopCountdown();
      showStep('form');
      const emailInput = dlg.querySelector('#authEmail');
      if (emailInput) emailInput.focus();
    });

    dlg.querySelector('#otpStartBtn')?.addEventListener('click', () => requestOtp());
    dlg.querySelector('#otpResendBtn')?.addEventListener('click', () => requestOtp({ fromResend: true }));
    dlg.querySelector('#otpVerifyBtn')?.addEventListener('click', () => verifyAuth());

    const emailInput = dlg.querySelector('#authEmail');
    if (emailInput) {
      emailInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          requestOtp();
        }
      });
    }
    const codeInput = dlg.querySelector('#authCode');
    if (codeInput) {
      codeInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          verifyAuth();
        }
      });
    }
  }

  function setAuthMode(mode = 'signup') {
    currentAuthMode = mode === 'login' ? 'login' : 'signup';
    const dlg = getDialog();
    dlg.querySelectorAll('[data-auth-mode]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.authMode === currentAuthMode);
    });
    const nameRow = dlg.querySelector('#authNameRow');
    if (nameRow) {
      if (currentAuthMode === 'signup') {
        nameRow.classList.remove('hidden');
      } else {
        nameRow.classList.add('hidden');
      }
    }
    const title = dlg.querySelector('#authModalTitle');
    const subtitle = dlg.querySelector('#authModalSubtitle');
    if (title) {
      title.textContent = currentAuthMode === 'signup' ? 'Créer mon compte' : 'Connexion rapide';
    }
    if (subtitle) {
      subtitle.textContent = currentAuthMode === 'signup'
        ? 'Entre ton nom et ton email pour créer ton espace CMP.'
        : 'Saisis simplement ton email pour recevoir un code de connexion.';
    }
  }

  function showStep(step) {
    const dlg = getDialog();
    const formStep = dlg.querySelector('#authStepForm');
    const codeStep = dlg.querySelector('#authStepCode');
    if (!formStep || !codeStep) return;
    if (step === 'code') {
      formStep.classList.add('hidden');
      codeStep.classList.remove('hidden');
    } else {
      formStep.classList.remove('hidden');
      codeStep.classList.add('hidden');
    }
  }

  function resetAuthDialog() {
    const dlg = getDialog();
    const first = dlg.querySelector('#authFirstName');
    const last = dlg.querySelector('#authLastName');
    const email = dlg.querySelector('#authEmail');
    const code = dlg.querySelector('#authCode');
    if (first) first.value = '';
    if (last) last.value = '';
    if (email) email.value = '';
    if (code) code.value = '';
    dlg.dataset.lastEmail = '';
    stopCountdown();
    showStep('form');
    setAuthMode('signup');
    const resendBtn = dlg.querySelector('#otpResendBtn');
    if (resendBtn) resendBtn.disabled = true;
    const countdownLabel = dlg.querySelector('#otpCountdown');
    if (countdownLabel) countdownLabel.textContent = 'Renvoyer un code dans 01:00';
  }

  function focusInitialField() {
    const dlg = getDialog();
    const target = currentAuthMode === 'signup'
      ? dlg.querySelector('#authFirstName')
      : dlg.querySelector('#authEmail');
    if (target) target.focus();
  }

  function startCountdown(seconds = 60) {
    stopCountdown();
    countdownRemaining = seconds;
    updateCountdown();
    countdownTimer = setInterval(() => {
      countdownRemaining -= 1;
      updateCountdown();
      if (countdownRemaining <= 0) {
        stopCountdown();
      }
    }, 1000);
  }

  function stopCountdown() {
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
    const dlg = getDialog();
    const countdownLabel = dlg.querySelector('#otpCountdown');
    const resendBtn = dlg.querySelector('#otpResendBtn');
    if (countdownLabel) {
      countdownLabel.textContent = 'Vous pouvez renvoyer un code.';
    }
    if (resendBtn) {
      resendBtn.disabled = false;
    }
  }

  function updateCountdown() {
    const dlg = getDialog();
    const countdownLabel = dlg.querySelector('#otpCountdown');
    const resendBtn = dlg.querySelector('#otpResendBtn');
    if (!countdownLabel || !resendBtn) return;

    if (countdownRemaining > 0) {
      const mins = String(Math.floor(countdownRemaining / 60)).padStart(2, '0');
      const secs = String(countdownRemaining % 60).padStart(2, '0');
      countdownLabel.textContent = `Renvoyer un code dans ${mins}:${secs}`;
      resendBtn.disabled = true;
    } else {
      countdownLabel.textContent = 'Vous pouvez renvoyer un code.';
      resendBtn.disabled = false;
    }
  }

  function showCodeStep(email) {
    const dlg = getDialog();
    dlg.dataset.lastEmail = (email || '').toLowerCase();
    const summary = dlg.querySelector('#otpSummary');
    if (summary) {
      summary.textContent = `Un code vient d'être envoyé à ${email}.`;
    }
    showStep('code');
    const codeInput = dlg.querySelector('#authCode');
    if (codeInput) {
      codeInput.value = '';
      codeInput.focus();
    }
    const resendBtn = dlg.querySelector('#otpResendBtn');
    if (resendBtn) resendBtn.disabled = true;
  }

  function getFormValues() {
    const dlg = getDialog();
    const first = dlg.querySelector('#authFirstName');
    const last = dlg.querySelector('#authLastName');
    const email = dlg.querySelector('#authEmail');
    return {
      firstName: first ? first.value.trim() : '',
      lastName: last ? last.value.trim() : '',
      email: email ? email.value.trim().toLowerCase() : ''
    };
  }

  function toggleButtonLoading(btn, isLoading, loadingLabel) {
    if (!btn) return;
    if (isLoading) {
      if (!btn.dataset.initialLabel) {
        btn.dataset.initialLabel = btn.textContent;
      }
      if (loadingLabel) {
        btn.textContent = loadingLabel;
      }
      btn.classList.add('loading');
      btn.disabled = true;
    } else {
      btn.classList.remove('loading');
      if (btn.dataset.initialLabel) {
        btn.textContent = btn.dataset.initialLabel;
      }
      btn.disabled = false;
    }
  }

  async function requestOtp(options = {}) {
    const dlg = getDialog();
    const { fromResend = false } = options;
    const startBtn = dlg.querySelector('#otpStartBtn');
    const resendBtn = dlg.querySelector('#otpResendBtn');

    const { firstName, lastName, email } = getFormValues();
    if (!email) {
      showToast('Merci de renseigner votre email.');
      const emailInput = dlg.querySelector('#authEmail');
      if (emailInput) emailInput.focus();
      return;
    }
    if (currentAuthMode === 'signup' && !firstName) {
      showToast('Le prénom est requis pour créer un compte.');
      const firstInput = dlg.querySelector('#authFirstName');
      if (firstInput) firstInput.focus();
      return;
    }

    if (fromResend) {
      toggleButtonLoading(resendBtn, true, 'Renvoi...');
    } else {
      toggleButtonLoading(startBtn, true, 'Envoi...');
    }

    try {
      await apiPost('/auth/start/', {
        first_name: currentAuthMode === 'signup' ? firstName : '',
        last_name: currentAuthMode === 'signup' ? lastName : '',
        email,
        mode: currentAuthMode
      });
      showCodeStep(email);
      startCountdown(60);
      showToast('Code envoyé 📩', { kind: 'success' });
      if (fromResend) {
        toggleButtonLoading(resendBtn, false);
        if (resendBtn) resendBtn.disabled = true;
      }
    } catch (e) {
      showToast(e.message || 'Impossible d’envoyer le code');
      if (fromResend) {
        toggleButtonLoading(resendBtn, false);
      }
    } finally {
      if (!fromResend) {
        toggleButtonLoading(startBtn, false);
      }
    }
  }

  async function verifyAuth() {
    const dlg = getDialog();
    const verifyBtn = dlg.querySelector('#otpVerifyBtn');
    const email = (dlg.dataset.lastEmail || '').trim().toLowerCase() || (dlg.querySelector('#authEmail')?.value.trim().toLowerCase() || '');
    const code = (dlg.querySelector('#authCode')?.value || '').trim();

    if (!email || !code) {
      showToast('Merci de renseigner votre email et le code reçu.');
      return;
    }

    toggleButtonLoading(verifyBtn, true, 'Connexion...');
    try {
      await apiPost('/auth/verify/', { email, code });
      dlg.close();
      resetAuthDialog();
      await checkAuth();
      if (window.AUTH_OTP && typeof window.AUTH_OTP.nextAction === 'function') {
        const todo = window.AUTH_OTP.nextAction;
        window.AUTH_OTP.nextAction = null;
        try { todo(); } catch {}
      }
      showToast('Connexion réussie 🙌', { kind: 'success' });
    } catch (e) {
      showToast(e.message || 'Code invalide');
    } finally {
      toggleButtonLoading(verifyBtn, false);
    }
  }

  function openAuthDialogOTP() {
    const dlg = getDialog();
    initDialog();
    resetAuthDialog();
    dlg.showModal();
    focusInitialField();
  }

  function patchAuthButtons() {
    const signInBtn = document.getElementById('signInBtn');
    if (signInBtn && !signInBtn.dataset.otpReady) {
      signInBtn.dataset.otpReady = '1';
      signInBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openAuthDialogOTP();
      });
    }

  }

  if (!window.MODALS) window.MODALS = {};
  window.MODALS.openAuthDialog = openAuthDialogOTP;
  window.AUTH_OTP.signOut = signOut;
  window.AUTH_OTP.openDialog = openAuthDialogOTP;

  (function wrapOpenTestimonyForm() {
    const modals = window.MODALS || {};
    const original = modals.openTestimonyForm;
    if (typeof original === 'function') {
      modals.openTestimonyForm = function () {
        window.AUTH_OTP.ensureAuthThen(() => original());
      };
    } else {
      setTimeout(wrapOpenTestimonyForm, 50);
    }
  })();

  function ensureToastStyles() {
    if (document.getElementById('toast-styles')) return;
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      .toast-container {
        position: fixed;
        top: 24px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 2147483647;
        display: flex;
        flex-direction: column;
        gap: 12px;
        pointer-events: none;
      }
      .toast {
        background: rgba(15, 23, 42, 0.98);
        color: #fff;
        border-radius: 16px;
        box-shadow: 0 20px 45px rgba(15, 23, 42, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.08);
        padding: 16px 20px;
        min-width: 280px;
        max-width: min(420px, 92vw);
        display: flex;
        align-items: center;
        gap: 12px;
        animation: toastIn .25s ease-out;
        border: 1px solid rgba(255, 255, 255, 0.35);
        backdrop-filter: blur(0) saturate(160%);
        pointer-events: auto;
        font-size: 15px;
        line-height: 1.5;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
      }
      .toast.success {
        border-color: rgba(34, 197, 94, 0.6);
      }
      .toast .toast-msg {
        flex: 1;
        font-size: 15px;
        line-height: 1.5;
        font-weight: 500;
      }
      .toast .toast-actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .toast .toast-btn {
        background: #fbbf24;
        color: #1f2937;
        border: none;
        border-radius: 999px;
        padding: 6px 12px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 600;
      }
      .toast .toast-close {
        background: transparent;
        border: none;
        cursor: pointer;
        color: rgba(255,255,255,0.8);
        font-size: 18px;
        line-height: 1;
      }
      @keyframes toastIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }

  function showToast(message, opts) {
    ensureToastStyles();
    const host = document.querySelector('dialog[open]') || document.body;
    const useBodyHost = host === document.body;
    let container = useBodyHost
      ? document.getElementById('toast-container')
      : host.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      if (useBodyHost) {
        container.id = 'toast-container';
      }
      host.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast${opts && opts.kind === 'success' ? ' success' : ''}`;
    toast.innerHTML = `
      <div class="toast-msg">${message}</div>
      <div class="toast-actions">
        ${opts && opts.actionText ? `<button class="toast-btn" type="button">${opts.actionText}</button>` : ''}
        <button class="toast-close" type="button" aria-label="Fermer">&times;</button>
      </div>
    `;
    container.appendChild(toast);
    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) closeBtn.addEventListener('click', () => container.removeChild(toast));
    const actionBtn = toast.querySelector('.toast-btn');
    if (actionBtn && opts && typeof opts.onAction === 'function') {
      actionBtn.addEventListener('click', () => {
        opts.onAction();
        if (toast.parentNode) container.removeChild(toast);
      });
    }
    if (!actionBtn) {
      setTimeout(() => {
        if (toast.parentNode) container.removeChild(toast);
      }, 2500);
    }
  }

  window.showToast = showToast;

  function init() {
    initDialog();
    checkAuth();
    const params = new URLSearchParams(window.location.search);
    if (params.get('signin') === '1') openAuthDialogOTP();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
