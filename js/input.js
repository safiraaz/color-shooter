// input.js — keyboard dan tombol UI

// Keyboard
document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
    case 'a':
      e.preventDefault();
      changeColor(-1);
      break;
    case 'ArrowRight':
    case 'd':
      e.preventDefault();
      changeColor(1);
      break;
    case 'ArrowUp':
    case ' ':
    case 'Enter':
      e.preventDefault();
      shoot();
      break;
  }
});

// Buttons
document.getElementById('btn-left').addEventListener('click', () => changeColor(-1));
document.getElementById('btn-right').addEventListener('click', () => changeColor(1));
document.getElementById('btn-shoot').addEventListener('click', () => shoot());
