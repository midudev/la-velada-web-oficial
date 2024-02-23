export const setupIntersectionObserver = (elementId: string, animationClass: string) => {
  const element = document.querySelector(`#${elementId}`);
  if (!element) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add(animationClass);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(element);
}
