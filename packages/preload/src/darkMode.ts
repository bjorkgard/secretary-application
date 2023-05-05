window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ({matches}) => {
  if (matches) {
    document.getElementsByTagName('body')[0].classList.add('dark');
  } else {
    document.getElementsByTagName('body')[0].classList.remove('dark');
  }
});
