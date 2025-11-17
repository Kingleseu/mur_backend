// Populate category select from CONFIG.CATEGORIES on DOM ready
(function(){
  function fillCategories(){
    var sel = document.getElementById('formCategory');
    if (!sel || !window.CONFIG || !Array.isArray(window.CONFIG.CATEGORIES)) return;
    var cats = window.CONFIG.CATEGORIES.filter(function(c){
      var lc = (c||'').toLowerCase();
      return lc !== 'tous' && lc.indexOf('vid') !== 0;
    });
    sel.innerHTML = '<option value="">— Choisir une catégorie —</option>' +
      cats.map(function(c){ return '<option value="'+c+'">'+c+'</option>'; }).join('');
  }
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', fillCategories);
  } else {
    fillCategories();
  }
})();

