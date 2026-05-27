/**
 * SkipLink — лінк для клавіатурних користувачів та скрін-рідерів.
 * Стає видимим лише при focus. Завжди перший фокусоване елемент сторінки.
 */
export function SkipLink() {
  return (
    <a href="#main-content" className="skip-link">
      Перейти до основного контенту
    </a>
  );
}
