function Button({
  type = "button",
  color = "primary",
  onClick,
  children,
  variant = "primary",
  radius = "rounded-xl",
  className = "",
  disabled = false,
}) {
  const styles = {
    primary: {
      primary: "bg-primary text-white hover:bg-primary-deep",
      secondary: "bg-text text-white border-transparent hover:bg-dark-deep/70",
    },
    outline: {
      primary: "bg-white text-primary border-primary hover:bg-primary/10",
      secondary: "bg-white text-text border-border hover:bg-surface-alt",
    },
  };

  const buttonStyle = styles[variant]?.[color] || styles.primary.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`border py-2 px-5 ${buttonStyle} ${radius} cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;