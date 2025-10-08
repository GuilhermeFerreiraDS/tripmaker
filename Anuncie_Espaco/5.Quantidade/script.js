document.querySelectorAll('.increase').forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      const countEl = document.getElementById(targetId);
  
      let currentValue = parseInt(countEl.textContent);
      if (isNaN(currentValue)) currentValue = 0; // Garante que comece em 0 se não for número
  
      countEl.textContent = currentValue + 1;
    });
  });
  
  document.querySelectorAll('.decrease').forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      const countEl = document.getElementById(targetId);
  
      let currentValue = parseInt(countEl.textContent);
      if (isNaN(currentValue) || currentValue <= 0) {
        currentValue = 0; // Não permite números negativos
      } else {
        currentValue--;
      }
  
      countEl.textContent = currentValue;
    });
  });
  