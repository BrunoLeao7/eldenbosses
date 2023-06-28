// Função para verificar as checkboxes e armazenar no localStorage
function salvarCheckboxStatus() {
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    var checkboxStatus = {};
  
    checkboxes.forEach(function (checkbox) {
      checkboxStatus[checkbox.id] = checkbox.checked;
    });
  
    localStorage.setItem('checkboxStatus', JSON.stringify(checkboxStatus));
  }
  
  // Função para carregar o status das checkboxes armazenado no localStorage
  function carregarCheckboxStatus() {
    var checkboxStatus = JSON.parse(localStorage.getItem('checkboxStatus'));
  
    if (checkboxStatus) {
      var checkboxes = document.querySelectorAll('input[type="checkbox"]');
  
      checkboxes.forEach(function (checkbox) {
        if (checkbox.id in checkboxStatus) {
          checkbox.checked = checkboxStatus[checkbox.id];
        }
      });
    }
  }
  
  // Chamar a função para carregar o status das checkboxes ao carregar a página
  window.addEventListener('load', carregarCheckboxStatus);
  
  // Chamar a função para salvar o status das checkboxes ao alterar alguma checkbox
  var checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener('change', salvarCheckboxStatus);
  });
  