/* @ds-bundle: {"format":4,"namespace":"TeeCrownConsultDesignSystem_08f0d5","components":[{"name":"BlogCard","sourcePath":"components/cards/BlogCard.jsx"},{"name":"OverlayCard","sourcePath":"components/cards/OverlayCard.jsx"},{"name":"PackageCard","sourcePath":"components/cards/PackageCard.jsx"},{"name":"ServiceCard","sourcePath":"components/cards/ServiceCard.jsx"},{"name":"TestimonialCard","sourcePath":"components/cards/TestimonialCard.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"Badge","sourcePath":"components/primitives/Badge.jsx"},{"name":"Divider","sourcePath":"components/primitives/Divider.jsx"},{"name":"SectionHeading","sourcePath":"components/primitives/SectionHeading.jsx"}],"sourceHashes":{"components/cards/BlogCard.jsx":"a4e24e0ec18b","components/cards/OverlayCard.jsx":"33f8d3a6bb39","components/cards/PackageCard.jsx":"bbd6f2a2b63b","components/cards/ServiceCard.jsx":"64096ab6c0fe","components/cards/TestimonialCard.jsx":"56bf43cfc38a","components/forms/Button.jsx":"153292d27e8a","components/forms/Input.jsx":"c1405a7e5e59","components/forms/Select.jsx":"825eb1b49d64","components/forms/Textarea.jsx":"1b89ec1f0419","components/primitives/Badge.jsx":"e470da1a3768","components/primitives/Divider.jsx":"1e2b88d01f01","components/primitives/SectionHeading.jsx":"078daa6f7808","ui_kits/website/Bits.jsx":"a03d5bef1f6a","ui_kits/website/BlogScreen.jsx":"cfa6af4d74a3","ui_kits/website/Footer.jsx":"b1a11a2312be","ui_kits/website/Header.jsx":"6f431e0455d1","ui_kits/website/HomeScreen.jsx":"1d78acc141da","ui_kits/website/ServicesScreen.jsx":"db905d5777a1","ui_kits/website/TourScreen.jsx":"d518071cb904","ui_kits/website/data.js":"9bc59e63d864"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.TeeCrownConsultDesignSystem_08f0d5 = window.TeeCrownConsultDesignSystem_08f0d5 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/cards/BlogCard.jsx
try { (() => {
/** Image-topped blog card with a green-dot category, title, excerpt and date footer. */
function BlogCard({
  image,
  category,
  title,
  excerpt,
  date,
  readMoreLabel,
  href,
  onClick,
  style
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("article", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: 'var(--color-white)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      boxShadow: hover ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
      transform: hover ? 'translateY(-4px)' : 'none',
      transition: 'transform var(--transition), box-shadow var(--transition)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '200px',
      overflow: 'hidden'
    }
  }, image && /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: title,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
      transform: hover ? 'scale(1.05)' : 'none',
      transition: 'transform 0.5s ease'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-md)'
    }
  }, category && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '7px',
      marginBottom: 'var(--space-xs)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: '9px',
      height: '9px',
      borderRadius: '50%',
      background: 'var(--color-accent)',
      flex: '0 0 auto'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-primary)',
      fontSize: '13px',
      color: 'var(--color-text)'
    }
  }, category)), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-primary)',
      color: 'var(--color-heading)',
      fontWeight: 700,
      fontSize: '18px',
      lineHeight: 1.3,
      marginBottom: 'var(--space-xs)'
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-primary)',
      color: 'var(--color-text-light)',
      fontSize: 'var(--fs-small)',
      lineHeight: 1.6,
      marginBottom: 'var(--space-sm)'
    }
  }, excerpt), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, date && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '13px',
      color: 'var(--color-text-light)'
    }
  }, date), readMoreLabel && /*#__PURE__*/React.createElement("a", {
    href: href,
    onClick: onClick,
    style: {
      fontFamily: 'var(--font-primary)',
      fontSize: 'var(--fs-small)',
      fontWeight: 600,
      color: 'var(--color-primary)',
      textDecoration: 'none'
    }
  }, readMoreLabel))));
}
Object.assign(__ds_scope, { BlogCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/BlogCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/OverlayCard.jsx
try { (() => {
/**
 * Photo card with a heading overlaid at the bottom — the site's signature
 * treatment for home services and tour packages. Image fills the card;
 * a dark scrim keeps the white heading legible; hover deepens a navy tint.
 */
function OverlayCard({
  image,
  title,
  subtitle,
  height = 300,
  href,
  onClick,
  style
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    href: href,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: 'relative',
      display: 'block',
      height: typeof height === 'number' ? `${height}px` : height,
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      textDecoration: 'none',
      boxShadow: hover ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
      transition: 'box-shadow var(--transition)',
      cursor: href || onClick ? 'pointer' : 'default',
      ...style
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: typeof title === 'string' ? title : '',
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transform: hover ? 'scale(1.06)' : 'scale(1)',
      transition: 'transform 0.6s ease'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--tcc-gradient-overlay-card)',
      mixBlendMode: 'normal'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--tcc-navy)',
      opacity: hover ? 0.28 : 0,
      transition: 'opacity var(--transition)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      padding: 'var(--space-md)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-primary)',
      color: '#fff',
      fontWeight: 700,
      fontSize: 'var(--fs-h4)',
      lineHeight: 1.25,
      margin: 0,
      textShadow: '0 1px 8px rgba(0,0,0,0.35)'
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'rgba(255,255,255,0.9)',
      fontSize: 'var(--fs-small)',
      marginTop: '6px',
      lineHeight: 1.5
    }
  }, subtitle)));
}
Object.assign(__ds_scope, { OverlayCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/OverlayCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/ServiceCard.jsx
try { (() => {
/** Icon + title + description card used in the Services grid. */
function ServiceCard({
  icon,
  title,
  description,
  details,
  align = 'center',
  style
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      textAlign: align,
      padding: align === 'left' ? 'var(--space-lg)' : 'var(--space-md)',
      background: 'var(--color-white)',
      borderRadius: 'var(--radius)',
      boxShadow: hover ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
      transform: hover ? 'translateY(-4px)' : 'none',
      transition: 'transform var(--transition), box-shadow var(--transition)',
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: align === 'left' ? '64px' : '48px',
      marginBottom: 'var(--space-sm)',
      lineHeight: 1
    }
  }, icon), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-primary)',
      color: 'var(--color-heading)',
      fontWeight: 700,
      fontSize: align === 'left' ? 'var(--fs-h3)' : 'var(--fs-h4)',
      marginBottom: 'var(--space-xs)'
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-primary)',
      color: 'var(--color-text-light)',
      fontSize: 'var(--fs-small)',
      lineHeight: 1.7
    }
  }, description), details && details.length > 0 && /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'disc',
      paddingLeft: '20px',
      textAlign: 'left',
      marginTop: 'var(--space-sm)'
    }
  }, details.map((d, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      fontSize: 'var(--fs-small)',
      color: 'var(--color-text-light)',
      marginBottom: '6px'
    }
  }, d))));
}
Object.assign(__ds_scope, { ServiceCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/ServiceCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/TestimonialCard.jsx
try { (() => {
/** Testimonial card — star rating, italic quote, author + role footer. */
function TestimonialCard({
  rating = 5,
  text,
  name,
  title,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--color-white)',
      borderRadius: 'var(--radius)',
      padding: 'var(--space-lg)',
      boxShadow: 'var(--shadow-card)',
      minHeight: '280px',
      display: 'flex',
      flexDirection: 'column',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--tcc-star)',
      fontSize: '18px',
      letterSpacing: '2px',
      marginBottom: 'var(--space-sm)'
    }
  }, '★'.repeat(rating), '☆'.repeat(Math.max(0, 5 - rating))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-primary)',
      fontSize: '15px',
      lineHeight: 1.7,
      color: 'var(--color-text)',
      fontStyle: 'italic',
      flex: 1,
      marginBottom: 'var(--space-md)'
    }
  }, "\u201C", text, "\u201D"), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--color-border)',
      paddingTop: 'var(--space-sm)'
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      display: 'block',
      fontSize: 'var(--fs-small)',
      color: 'var(--color-heading)',
      fontWeight: 700
    }
  }, name), title && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '13px',
      color: 'var(--color-text-light)'
    }
  }, title)));
}
Object.assign(__ds_scope, { TestimonialCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/TestimonialCard.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const base = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  fontFamily: 'var(--font-accent)',
  fontWeight: 500,
  lineHeight: 1.4,
  borderRadius: 'var(--radius-btn)',
  border: 'none',
  cursor: 'pointer',
  textDecoration: 'none',
  transition: 'all var(--transition)',
  whiteSpace: 'nowrap'
};
const sizes = {
  sm: {
    padding: '8px 20px',
    fontSize: 'var(--fs-small)'
  },
  md: {
    padding: '12px 28px',
    fontSize: 'var(--fs-body)'
  },
  lg: {
    padding: '16px 40px',
    fontSize: '18px'
  }
};
const variants = {
  primary: {
    background: 'var(--color-primary)',
    color: 'var(--color-white)'
  },
  accent: {
    background: 'var(--color-accent)',
    color: 'var(--color-white)'
  },
  outline: {
    background: 'transparent',
    color: 'var(--color-primary)',
    border: '2px solid var(--color-primary)'
  },
  white: {
    background: 'var(--color-white)',
    color: 'var(--color-primary)'
  },
  link: {
    background: 'none',
    color: 'var(--color-primary)',
    padding: 0,
    fontWeight: 600,
    fontFamily: 'var(--font-primary)'
  }
};
const hovers = {
  primary: {
    background: 'var(--color-primary-dark)'
  },
  accent: {
    background: 'var(--color-accent-dark)'
  },
  outline: {
    background: 'var(--color-primary)',
    color: 'var(--color-white)'
  },
  white: {
    background: 'var(--color-primary)',
    color: 'var(--color-white)'
  },
  link: {
    color: 'var(--color-accent)'
  }
};

/**
 * Tee'Crown Consult button. Navy primary, green accent, plus outline/white/link.
 */
function Button({
  variant = 'primary',
  size = 'md',
  as = 'button',
  href,
  disabled = false,
  iconLeft,
  iconRight,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const Tag = as === 'a' || href ? 'a' : 'button';
  const composed = {
    ...base,
    ...(variant === 'link' ? {} : sizes[size]),
    ...variants[variant],
    ...(hover && !disabled ? hovers[variant] : null),
    ...(disabled ? {
      opacity: 0.5,
      cursor: 'not-allowed'
    } : null),
    ...style
  };
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    disabled: Tag === 'button' ? disabled : undefined,
    style: composed,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/cards/PackageCard.jsx
try { (() => {
/** Image-topped package card used in the Packages carousel. */
function PackageCard({
  image,
  title,
  location,
  excerpt,
  ctaLabel = 'Learn More',
  onCta,
  href,
  style
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: 'var(--color-white)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      boxShadow: hover ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
      transform: hover ? 'translateY(-4px)' : 'none',
      transition: 'transform var(--transition), box-shadow var(--transition)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '200px',
      overflow: 'hidden'
    }
  }, image && /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: title,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
      transform: hover ? 'scale(1.05)' : 'none',
      transition: 'transform 0.5s ease'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-md)',
      display: 'flex',
      flexDirection: 'column',
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-primary)',
      color: 'var(--color-heading)',
      fontWeight: 700,
      fontSize: '18px',
      marginBottom: 'var(--space-xs)'
    }
  }, title), location && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '13px',
      color: 'var(--color-text-light)',
      marginBottom: 'var(--space-xs)'
    }
  }, location), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-primary)',
      color: 'var(--color-text-light)',
      fontSize: 'var(--fs-small)',
      lineHeight: 1.6,
      marginBottom: 'var(--space-sm)',
      flex: 1
    }
  }, excerpt), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    size: "sm",
    href: href,
    onClick: onCta
  }, ctaLabel))));
}
Object.assign(__ds_scope, { PackageCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/PackageCard.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const labelStyle = {
  display: 'block',
  fontSize: 'var(--fs-small)',
  fontWeight: 600,
  marginBottom: '4px',
  color: 'var(--color-text)',
  fontFamily: 'var(--font-primary)'
};
const fieldBase = {
  width: '100%',
  padding: '12px 16px',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius)',
  fontFamily: 'var(--font-primary)',
  fontSize: 'var(--fs-body)',
  color: 'var(--color-text)',
  background: 'var(--color-white)',
  transition: 'border-color var(--transition)',
  outline: 'none'
};

/** Labeled text input matching the Tee'Crown contact form. */
function Input({
  label,
  id,
  type = 'text',
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const field = {
    ...fieldBase,
    ...(focus ? {
      borderColor: 'var(--color-primary)'
    } : null),
    ...style
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 'var(--space-sm)'
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: labelStyle
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    type: type,
    style: field,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false)
  }, rest)));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const labelStyle = {
  display: 'block',
  fontSize: 'var(--fs-small)',
  fontWeight: 600,
  marginBottom: '4px',
  color: 'var(--color-text)',
  fontFamily: 'var(--font-primary)'
};
const fieldBase = {
  width: '100%',
  padding: '12px 16px',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius)',
  fontFamily: 'var(--font-primary)',
  fontSize: 'var(--fs-body)',
  color: 'var(--color-text)',
  background: 'var(--color-white)',
  transition: 'border-color var(--transition)',
  outline: 'none',
  appearance: 'none',
  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\'%3E%3Cpath fill=\'%2354595F\' d=\'M6 8 0 0h12z\'/%3E%3C/svg%3E")',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 16px center',
  paddingRight: '40px'
};

/** Labeled dropdown matching the Tee'Crown contact form. */
function Select({
  label,
  id,
  options = [],
  children,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const selId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const field = {
    ...fieldBase,
    ...(focus ? {
      borderColor: 'var(--color-primary)'
    } : null),
    ...style
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 'var(--space-sm)'
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: selId,
    style: labelStyle
  }, label), /*#__PURE__*/React.createElement("select", _extends({
    id: selId,
    style: field,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false)
  }, rest), children || options.map(o => {
    const val = typeof o === 'string' ? o : o.value;
    const lbl = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: val,
      value: val
    }, lbl);
  })));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const labelStyle = {
  display: 'block',
  fontSize: 'var(--fs-small)',
  fontWeight: 600,
  marginBottom: '4px',
  color: 'var(--color-text)',
  fontFamily: 'var(--font-primary)'
};
const fieldBase = {
  width: '100%',
  padding: '12px 16px',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius)',
  fontFamily: 'var(--font-primary)',
  fontSize: 'var(--fs-body)',
  color: 'var(--color-text)',
  background: 'var(--color-white)',
  transition: 'border-color var(--transition)',
  outline: 'none',
  minHeight: '120px',
  resize: 'vertical'
};

/** Labeled multi-line textarea matching the Tee'Crown contact form. */
function Textarea({
  label,
  id,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const taId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const field = {
    ...fieldBase,
    ...(focus ? {
      borderColor: 'var(--color-primary)'
    } : null),
    ...style
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 'var(--space-sm)'
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: taId,
    style: labelStyle
  }, label), /*#__PURE__*/React.createElement("textarea", _extends({
    id: taId,
    style: field,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false)
  }, rest)));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/primitives/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const tones = {
  accent: {
    background: 'var(--color-accent)',
    color: 'var(--color-white)'
  },
  navy: {
    background: 'var(--color-primary)',
    color: 'var(--color-white)'
  },
  soft: {
    background: 'var(--color-bg-alt)',
    color: 'var(--color-primary)'
  }
};

/** Uppercase category chip — used on blog cards and content tags. */
function Badge({
  tone = 'accent',
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: 'var(--radius-pill)',
      fontFamily: 'var(--font-primary)',
      fontSize: '12px',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: 'var(--ls-nav)',
      lineHeight: 1.4,
      ...tones[tone],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/primitives/Badge.jsx", error: String((e && e.message) || e) }); }

// components/primitives/Divider.jsx
try { (() => {
/** Short green rule — the brand's section divider, centered under headings. */
function Divider({
  align = 'center',
  style
}) {
  const margin = align === 'center' ? '0 auto var(--space-lg)' : align === 'left' ? '0 0 var(--space-lg)' : '0 0 0 auto';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '80px',
      height: '4px',
      background: 'var(--color-accent)',
      borderRadius: '2px',
      margin,
      ...style
    }
  });
}
Object.assign(__ds_scope, { Divider });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/primitives/Divider.jsx", error: String((e && e.message) || e) }); }

// components/primitives/SectionHeading.jsx
try { (() => {
/** Centered section heading — navy title with optional grey subtitle. */
function SectionHeading({
  title,
  subtitle,
  align = 'center',
  divider = false,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: align,
      marginBottom: 'var(--space-lg)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-primary)',
      color: 'var(--color-heading)',
      fontSize: 'var(--fs-h2)',
      fontWeight: 700,
      lineHeight: 'var(--lh-tight)',
      margin: 0
    }
  }, title || children), divider && /*#__PURE__*/React.createElement("div", {
    style: {
      width: '80px',
      height: '4px',
      background: 'var(--color-accent)',
      borderRadius: '2px',
      margin: align === 'center' ? 'var(--space-sm) auto 0' : 'var(--space-sm) 0 0'
    }
  }), subtitle && /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-primary)',
      color: 'var(--color-text-light)',
      fontSize: 'var(--fs-body)',
      lineHeight: 'var(--lh-body)',
      marginTop: 'var(--space-sm)',
      maxWidth: '600px',
      marginLeft: align === 'center' ? 'auto' : 0,
      marginRight: align === 'center' ? 'auto' : 0
    }
  }, subtitle));
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/primitives/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Bits.jsx
try { (() => {
// Shared layout bits for the website UI kit — matched to the live Elementor site.
const {
  Button
} = window.TeeCrownConsultDesignSystem_08f0d5;
const Container = ({
  children,
  style
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    maxWidth: 'var(--container-width)',
    margin: '0 auto',
    padding: '0 var(--container-padding)',
    ...style
  }
}, children);
const Section = ({
  children,
  tint,
  style
}) => /*#__PURE__*/React.createElement("section", {
  style: {
    padding: 'var(--section-pad) 0',
    background: tint === 'blue' ? 'var(--tcc-tint-blue)' : tint === 'alt' ? 'var(--color-bg-alt)' : 'var(--color-bg)',
    ...style
  }
}, /*#__PURE__*/React.createElement(Container, null, children));

// Home hero — photo (Ken-Burns-style) under a navy scrim, one white Explore button.
function Hero({
  onExplore
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      minHeight: 'var(--hero-min-height)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      color: '#fff',
      overflow: 'hidden',
      padding: '50px 20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: "var(--tcc-scrim-hero), url('../../assets/hero-dubai.avif') center/cover no-repeat",
      backgroundBlendMode: 'multiply',
      transform: 'scale(1.04)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: '820px'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-primary)',
      color: '#fff',
      fontSize: 'var(--fs-display)',
      fontWeight: 700,
      lineHeight: 1.1,
      margin: 0
    }
  }, "Let the Journey Begin"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-accent)',
      fontSize: '23px',
      fontWeight: 500,
      color: '#fff',
      margin: '14px 0 26px'
    }
  }, "Promoting sustainable and responsible tourism practices"), /*#__PURE__*/React.createElement(Button, {
    variant: "white",
    size: "sm",
    onClick: onExplore
  }, "Explore")));
}

// Short navy hero for interior pages.
function PageHero({
  title
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      minHeight: '320px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      color: '#fff',
      overflow: 'hidden',
      padding: '110px 20px 50px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: "var(--tcc-scrim-testimonial), url('../../assets/hero-beach.jpg') center/cover no-repeat",
      backgroundBlendMode: 'multiply'
    }
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      position: 'relative',
      fontFamily: 'var(--font-primary)',
      color: '#fff',
      fontSize: 'var(--fs-h1)',
      fontWeight: 700,
      margin: 0
    }
  }, title));
}

// Slate rounded call-to-action panel sitting inside a white section.
function CtaPanel({
  onContact
}) {
  return /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--tcc-slate)',
      borderRadius: '10px',
      color: '#fff',
      padding: '64px 40px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-primary)',
      color: '#fff',
      fontSize: 'var(--fs-h2)',
      fontWeight: 700,
      margin: '0 auto',
      maxWidth: '760px'
    }
  }, "Let's Craft the Most Amazing Experience for You"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '260px',
      height: '1px',
      background: 'rgba(255,255,255,0.5)',
      margin: '28px auto'
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "white",
    size: "sm",
    onClick: onContact
  }, "Contact Us")));
}
Object.assign(window, {
  Container,
  Section,
  Hero,
  PageHero,
  CtaPanel
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Bits.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/BlogScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Blog — page hero, 2-col post grid + sidebar (search, popular posts).
const {
  BlogCard,
  Button,
  Input
} = window.TeeCrownConsultDesignSystem_08f0d5;
function BlogScreen() {
  const d = window.TCC_DATA;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHero, {
    title: "Blog"
  }), /*#__PURE__*/React.createElement(Section, {
    alt: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '40px',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '30px'
    }
  }, d.blog.map(b => /*#__PURE__*/React.createElement(BlogCard, _extends({
    key: b.title
  }, b, {
    onClick: e => e && e.preventDefault()
  })))), /*#__PURE__*/React.createElement("aside", {
    style: {
      position: 'sticky',
      top: '100px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 'var(--space-lg)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-primary)',
      fontSize: 'var(--fs-h4)',
      color: 'var(--color-heading)',
      fontWeight: 700,
      marginBottom: 'var(--space-sm)',
      paddingBottom: 'var(--space-xs)',
      borderBottom: '2px solid var(--color-accent)'
    }
  }, "Search"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '8px',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Search posts\u2026",
    style: {
      marginBottom: 0
    }
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "primary"
  }, "Go"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-primary)',
      fontSize: 'var(--fs-h4)',
      color: 'var(--color-heading)',
      fontWeight: 700,
      marginBottom: 'var(--space-sm)',
      paddingBottom: 'var(--space-xs)',
      borderBottom: '2px solid var(--color-accent)'
    }
  }, "Popular Posts"), /*#__PURE__*/React.createElement("ul", null, d.blog.slice(0, 4).map(b => /*#__PURE__*/React.createElement("li", {
    key: b.title,
    style: {
      padding: '10px 0',
      borderBottom: '1px solid var(--color-border)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      fontSize: 'var(--fs-small)',
      color: 'var(--color-text)',
      lineHeight: 1.4,
      textDecoration: 'none'
    }
  }, b.title)))))))));
}
window.BlogScreen = BlogScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/BlogScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Footer.jsx
try { (() => {
// Site footer — packages, services, contact, social. Composes nothing (link-only).
function Footer({
  onNavigate
}) {
  const col = {
    color: '#fff',
    fontSize: '18px',
    marginBottom: 'var(--space-md)',
    fontWeight: 700,
    fontFamily: 'var(--font-primary)'
  };
  const link = {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 'var(--fs-small)',
    textDecoration: 'none',
    display: 'block',
    padding: '5px 0',
    cursor: 'pointer'
  };
  const packages = ['Honeymoon', 'Vacation', 'Pilgrimage', 'Medical', 'Custom'];
  const services = ['Flight Reservation', 'Visa Assistance', 'Student Visa', 'Insurance'];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--color-bg-dark)',
      color: 'rgba(255,255,255,0.8)',
      padding: 'var(--space-xl) 0 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-width)',
      margin: '0 auto',
      padding: '0 var(--container-padding)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '40px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    style: col
  }, "Packages"), packages.map(p => /*#__PURE__*/React.createElement("a", {
    key: p,
    style: link,
    onClick: () => onNavigate('Tour')
  }, p))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    style: col
  }, "Services"), services.map(s => /*#__PURE__*/React.createElement("a", {
    key: s,
    style: link,
    onClick: () => onNavigate('Services')
  }, s))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    style: col
  }, "Contact"), /*#__PURE__*/React.createElement("address", {
    style: {
      fontStyle: 'normal',
      fontSize: 'var(--fs-small)',
      lineHeight: 1.9,
      color: 'rgba(255,255,255,0.7)'
    }
  }, "18B Emmanuel Street Ojota,", /*#__PURE__*/React.createElement("br", null), "Kosofe, Lagos", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--color-accent)'
    }
  }, "bookings@teecrownconsult.org"), /*#__PURE__*/React.createElement("br", null), "08113860670")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    style: col
  }, "Social"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '10px'
    }
  }, [{
    n: 'Facebook',
    c: '#1877F2',
    g: 'f'
  }, {
    n: 'X',
    c: '#000000',
    g: '𝕏'
  }, {
    n: 'Instagram',
    c: '#E1306C',
    g: '◉'
  }, {
    n: 'YouTube',
    c: '#FF0000',
    g: '▶'
  }].map(s => /*#__PURE__*/React.createElement("a", {
    key: s.n,
    title: s.n,
    style: {
      width: '34px',
      height: '34px',
      borderRadius: '50%',
      background: s.c,
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '15px',
      textDecoration: 'none',
      cursor: 'pointer'
    }
  }, s.g))), /*#__PURE__*/React.createElement("a", {
    style: {
      ...link,
      color: 'var(--color-accent)',
      marginTop: '14px',
      fontWeight: 600
    }
  }, "Click to Join our Affiliate Program"))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid rgba(255,255,255,0.1)',
      marginTop: 'var(--space-lg)',
      padding: 'var(--space-md) 0',
      textAlign: 'center',
      fontSize: 'var(--fs-small)',
      color: 'rgba(255,255,255,0.5)'
    }
  }, "\xA9 2026 TeeCrown Consult. All rights reserved.")));
}
window.Footer = Footer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Header.jsx
try { (() => {
// Fixed site header — logo, nav, Contact button. Composes DS Button.
const {
  Button
} = window.TeeCrownConsultDesignSystem_08f0d5;
function Header({
  current,
  onNavigate,
  onContact,
  scrolled
}) {
  const links = ['Home', 'About', 'Services', 'Tour', 'Blog'];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255,255,255,0.97)',
      backdropFilter: 'blur(10px)',
      borderBottom: `1px solid ${scrolled ? 'var(--color-border)' : 'transparent'}`,
      boxShadow: scrolled ? 'var(--shadow-header)' : 'none',
      transition: 'all var(--transition)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      maxWidth: 'var(--container-width)',
      margin: '0 auto',
      padding: '0 var(--container-padding)',
      height: 'var(--header-height)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNavigate('Home');
    },
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-landscape.png",
    alt: "Tee'Crown Consult",
    style: {
      height: '46px',
      width: 'auto',
      display: 'block'
    }
  })), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '32px'
    }
  }, links.map(l => {
    const active = current === l;
    return /*#__PURE__*/React.createElement("a", {
      key: l,
      href: "#",
      onClick: e => {
        e.preventDefault();
        onNavigate(l);
      },
      style: {
        fontFamily: 'var(--font-secondary)',
        fontSize: 'var(--fs-small)',
        fontWeight: 500,
        color: active ? 'var(--color-primary)' : 'var(--color-text)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--ls-nav)',
        textDecoration: 'none',
        padding: '4px 0',
        borderBottom: `2px solid ${active ? 'var(--color-accent)' : 'transparent'}`
      }
    }, l);
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: onContact
  }, "Contact")));
}
window.Header = Header;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/HomeScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Home — hero, intro, overlay service cards, photo testimonial band,
// overlay package carousel, light-blue blog section, slate CTA panel.
const {
  OverlayCard,
  BlogCard,
  TestimonialCard,
  Button
} = window.TeeCrownConsultDesignSystem_08f0d5;
function Arrow({
  dir,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    "aria-label": dir === 'prev' ? 'Previous' : 'Next',
    style: {
      width: '40px',
      height: '40px',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: 'var(--color-primary)',
      fontSize: '34px',
      lineHeight: 1,
      flex: '0 0 auto'
    }
  }, dir === 'prev' ? '‹' : '›');
}
function Dots({
  count,
  active,
  onSelect,
  light
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '8px',
      justifyContent: 'center',
      marginTop: 'var(--space-md)'
    }
  }, Array.from({
    length: count
  }).map((_, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => onSelect(i),
    "aria-label": `Slide ${i + 1}`,
    style: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      background: i === active ? light ? '#fff' : 'var(--color-primary)' : light ? 'rgba(255,255,255,0.4)' : 'var(--tcc-border)',
      transition: 'background var(--transition)'
    }
  })));
}
function HomeScreen({
  onNavigate,
  onContact
}) {
  const d = window.TCC_DATA;
  const homeServices = d.services.filter(s => s.title !== 'Flight & Ticket Reservation');
  const homePackages = d.packages.filter(p => ['turkey', 'singapore', 'luxury-water'].includes(p.slug));
  const [tIndex, setTIndex] = React.useState(0);
  const t = d.testimonials[tIndex];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Hero, {
    onExplore: () => onNavigate('Tour')
  }), /*#__PURE__*/React.createElement(Section, {
    style: {
      paddingBottom: '30px'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      maxWidth: '900px',
      margin: '0 auto var(--space-lg)',
      textAlign: 'center',
      fontFamily: 'var(--font-primary)',
      fontSize: '15px',
      lineHeight: 1.8,
      color: 'var(--color-text)'
    }
  }, "Tee'Crown Consult Limited is dedicated to promoting sustainable and responsible tourism practices, working closely with local communities to ensure that tourism benefits are shared equitably, and preserving the uniquely rich heritage of Nigeria for posterity."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '24px'
    }
  }, homeServices.map(s => /*#__PURE__*/React.createElement(OverlayCard, {
    key: s.title,
    image: s.image,
    title: s.title,
    height: 300,
    onClick: e => {
      e.preventDefault();
      onNavigate('Services');
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginTop: 'var(--space-lg)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    onClick: () => onNavigate('About')
  }, "About Us"))), /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      minHeight: 'var(--band-min-height)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      color: '#fff',
      overflow: 'hidden',
      padding: '56px 20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: "var(--tcc-scrim-testimonial), url('../../assets/hero-beach.jpg') center/cover no-repeat",
      backgroundBlendMode: 'multiply'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: '820px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-primary)',
      color: '#fff',
      fontSize: 'var(--fs-h2)',
      fontWeight: 700,
      marginBottom: 'var(--space-md)'
    }
  }, "Testimonials"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-primary)',
      fontSize: '16px',
      lineHeight: 1.8,
      color: 'rgba(255,255,255,0.92)',
      fontStyle: 'italic'
    }
  }, "\u201C", t.text, "\u201D"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 'var(--space-md)',
      fontWeight: 700
    }
  }, t.name, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontWeight: 400,
      fontSize: '13px',
      opacity: 0.85
    }
  }, t.title)), /*#__PURE__*/React.createElement(Dots, {
    count: d.testimonials.length,
    active: tIndex,
    onSelect: setTIndex,
    light: true
  }))), /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement("h2", {
    style: {
      textAlign: 'center',
      fontFamily: 'var(--font-primary)',
      color: 'var(--color-heading)',
      fontSize: 'var(--fs-h2)',
      fontWeight: 700,
      marginBottom: 'var(--space-lg)'
    }
  }, "Our Packages"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement(Arrow, {
    dir: "prev",
    onClick: () => onNavigate('Tour')
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '24px'
    }
  }, homePackages.map(p => /*#__PURE__*/React.createElement(OverlayCard, {
    key: p.slug,
    image: p.image,
    title: p.title,
    subtitle: p.excerpt.slice(0, 78) + '…',
    height: 320,
    onClick: e => {
      e.preventDefault();
      onNavigate('Tour');
    }
  }))), /*#__PURE__*/React.createElement(Arrow, {
    dir: "next",
    onClick: () => onNavigate('Tour')
  }))), /*#__PURE__*/React.createElement(Section, {
    tint: "blue"
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      textAlign: 'center',
      fontFamily: 'var(--font-primary)',
      color: 'var(--color-heading)',
      fontSize: 'var(--fs-h2)',
      fontWeight: 700,
      marginBottom: 'var(--space-lg)'
    }
  }, "Stories, tips, and guides"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '24px'
    }
  }, d.blog.slice(0, 3).map(b => /*#__PURE__*/React.createElement(BlogCard, _extends({
    key: b.title
  }, b, {
    onClick: e => {
      e && e.preventDefault();
      onNavigate('Blog');
    }
  }))))), /*#__PURE__*/React.createElement(CtaPanel, {
    onContact: onContact
  }));
}
window.HomeScreen = HomeScreen;
Object.assign(window, {
  Arrow,
  Dots
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/ServicesScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Services — page hero, dropcap intro, detailed service cards.
const {
  ServiceCard
} = window.TeeCrownConsultDesignSystem_08f0d5;
function ServicesScreen() {
  const d = window.TCC_DATA;
  const details = ['Expert consultation and guidance', 'Hassle-free processing', 'Competitive rates and pricing', '24/7 customer support'];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHero, {
    title: "Our Services"
  }), /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: '800px',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '17px',
      lineHeight: 1.8,
      color: 'var(--color-text)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-secondary)',
      fontSize: '64px',
      fontWeight: 700,
      float: 'left',
      lineHeight: 0.9,
      margin: '4px 12px 0 0',
      color: 'var(--color-primary)'
    }
  }, "O"), "ur core services are designed to cover every aspect of your travel needs. From flight bookings to visa assistance, we provide end-to-end travel solutions that ensure a seamless and enjoyable experience. Our team of dedicated professionals works tirelessly to ensure every detail of your trip is carefully planned and executed."))), /*#__PURE__*/React.createElement(Section, {
    style: {
      paddingTop: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '30px'
    }
  }, d.services.map(s => /*#__PURE__*/React.createElement(ServiceCard, _extends({
    key: s.title,
    align: "left"
  }, s, {
    details: details
  }))))));
}
window.ServicesScreen = ServicesScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/ServicesScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/TourScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Tour — page hero, dropcap intro, full-width package rows (image + content).
const {
  Button,
  Badge
} = window.TeeCrownConsultDesignSystem_08f0d5;
function PackageRow({
  image,
  title,
  excerpt,
  reverse,
  onContact
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '30px',
      background: 'var(--color-white)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-card)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '300px',
      overflow: 'hidden',
      order: reverse ? 2 : 1
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: title,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-lg)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      order: reverse ? 1 : 2
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-primary)',
      color: 'var(--color-heading)',
      fontSize: 'var(--fs-h3)',
      fontWeight: 700,
      marginBottom: 'var(--space-sm)'
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--fs-small)',
      color: 'var(--color-text-light)',
      lineHeight: 1.7,
      marginBottom: 'var(--space-md)'
    }
  }, excerpt), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: onContact
  }, "Book Now"))));
}
function TourScreen({
  onContact
}) {
  const d = window.TCC_DATA;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHero, {
    title: "Tour Packages"
  }), /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: '800px',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '17px',
      lineHeight: 1.8,
      color: 'var(--color-text)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-secondary)',
      fontSize: '64px',
      fontWeight: 700,
      float: 'left',
      lineHeight: 0.9,
      margin: '4px 12px 0 0',
      color: 'var(--color-primary)'
    }
  }, "T"), "our packages are designed to give you the best travel experience at the most competitive prices. Whether it's a romantic honeymoon getaway, a family vacation, a spiritual pilgrimage, or a medical tourism package, we have something for everyone \u2014 each carefully curated for maximum value and enjoyment."))), /*#__PURE__*/React.createElement(Section, {
    style: {
      paddingTop: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: '40px'
    }
  }, d.packages.map((p, i) => /*#__PURE__*/React.createElement(PackageRow, _extends({
    key: p.slug
  }, p, {
    reverse: i % 2 === 1,
    onContact: onContact
  }))))));
}
window.TourScreen = TourScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/TourScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/data.js
try { (() => {
// Trimmed real content from the Tee'Crown Consult site (data/*.js).
window.TCC_DATA = {
  services: [{
    icon: '✈️',
    image: '../../assets/svc-flight.avif',
    title: 'Flight & Ticket Reservation',
    description: 'With access to multiple airlines, we search out the most competitive deals for your travel dates — saving you time and money. Sit back and let us handle the booking.'
  }, {
    icon: '🛂',
    image: '../../assets/svc-visa.avif',
    title: 'Visa Assistance',
    description: 'Our experienced consultants help you understand the visa requirements for your destination and ensure your application is complete and successful.'
  }, {
    icon: '🎓',
    image: '../../assets/svc-student-visa.avif',
    title: 'Student Visa Assistance',
    description: 'We know the specific requirements for student visas and support you through the whole study-abroad application, from documentation to submission.'
  }, {
    icon: '🛡️',
    image: '../../assets/svc-insurance.avif',
    title: 'Insurance',
    description: 'Find the right travel insurance for your needs. We offer a range of policies so you can match coverage to your budget.'
  }],
  packages: [{
    slug: 'honeymoon',
    title: 'Honeymoon',
    image: '../../assets/tour-honeymoon.jpg',
    excerpt: 'For couples celebrating their love — round-trip airfare, accommodation, sightseeing, dining and spa treatments.'
  }, {
    slug: 'vacation',
    title: 'Vacation',
    image: '../../assets/tour-vacation.jpg',
    excerpt: 'Perfect for families or groups of friends — airfare, accommodation, beach days, water sports and excursions.'
  }, {
    slug: 'pilgrimage',
    title: 'Pilgrimage',
    image: '../../assets/tour-pilgrimage.jpg',
    excerpt: 'Travel to a holy site for religious purposes — airfare, accommodation and transportation to and from the site.'
  }, {
    slug: 'medical',
    title: 'Medical',
    image: '../../assets/tour-medical.jpg',
    excerpt: 'For those travelling abroad for medical treatment — airfare, accommodation and medical expenses covered.'
  }, {
    slug: 'kenya',
    title: 'Experience the Magic of Kenya',
    image: '../../assets/tour-kenya.jpg',
    excerpt: 'Breathtaking savannahs, giraffes up close, and pristine beaches. Fast Kenya eTA processing within 48–72 hours.'
  }, {
    slug: 'turkey',
    title: 'Discover Turkey',
    image: '../../assets/tour-turkey.jpg',
    excerpt: 'Istanbul, Cappadocia and the Antalya coast. Visa guidance, flight support and travel consultation for Nigerian travellers.'
  }, {
    slug: 'singapore',
    title: 'A Trip to Singapore',
    image: '../../assets/tour-singapore.jpg',
    excerpt: 'Marina Bay Sands, Gardens by the Bay, Sentosa and Universal Studios. Visa assistance and vacation planning.'
  }, {
    slug: 'luxury-water',
    title: 'Luxury on the Water',
    image: '../../assets/tour-luxury-water.jpg',
    excerpt: 'Premium Lagos boat cruises for romantic escapes, celebrations and corporate retreats — full crew, décor and catering add-ons.'
  }, {
    slug: 'custom',
    title: 'Custom',
    image: '../../assets/tour-custom.jpg',
    excerpt: 'A bespoke itinerary built around your preferences and budget — every detail meticulously planned.'
  }],
  blog: [{
    category: 'Blog',
    title: 'Creating Memorable Journeys, One Trip at a Time',
    image: '../../assets/blog-memorable-journeys.jpg',
    date: 'June 4, 2026',
    excerpt: 'Every journey has a purpose — a family vacation, a business trip, a pilgrimage, or a chance to explore new horizons.'
  }, {
    category: 'Blog',
    title: 'Planning a Trip to Turkey from Nigeria?',
    image: '../../assets/blog-turkey-guide.jpg',
    date: 'May 12, 2026',
    excerpt: 'International travel begins long before you board a flight. It starts with proper guidance and a smooth visa process.'
  }, {
    category: 'Blog',
    title: "Tee'Crown's Community Engagement in Makoko",
    image: '../../assets/blog-makoko.jpg',
    date: 'February 24, 2026',
    excerpt: 'A structured community visit to Makoko — using responsible tourism as a platform for measurable social impact.'
  }, {
    category: 'Adventure',
    title: "Idere Hiking with Tee'Crown",
    image: '../../assets/blog-idere-hiking.jpg',
    date: 'January 29, 2025',
    excerpt: 'Guided hiking through the scenic hills of Oyo State — lush forests, rugged terrain and rich cultural heritage.'
  }, {
    category: 'Tourism',
    title: 'The Best Kept Secrets About Travel',
    image: '../../assets/blog-best-kept-secrets.jpg',
    date: 'August 20, 2024',
    excerpt: 'The difference between a tourist and a traveler is getting to know a culture. Talk to people; plan around what you love.'
  }, {
    category: 'Adventure',
    title: "I've Been a Traveler My Whole Life",
    image: '../../assets/blog-traveler-reflections.jpg',
    date: 'August 20, 2023',
    excerpt: 'Traveling with a child can significantly boost development — expanding their world and building empathy early.'
  }],
  testimonials: [{
    rating: 5,
    name: 'Carlos Tevez',
    title: 'Corporate Client',
    text: 'Booking a corporate retreat through Tee Crown Consult was a fantastic decision. The team-building activities, accommodations and flawless organization exceeded our expectations.'
  }, {
    rating: 5,
    name: 'Maya Kalisu',
    title: 'Solo Traveler',
    text: "As a solo traveler, safety was a top concern, and they went above and beyond to ensure I felt secure throughout my journey. My trip was unforgettable."
  }, {
    rating: 5,
    name: 'Alex Ofure',
    title: 'Satisfied Customer',
    text: 'Tee Crown Consult made my travel experience seamless and enjoyable. Their attention to detail and commitment to customer satisfaction is truly remarkable.'
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/data.js", error: String((e && e.message) || e) }); }

__ds_ns.BlogCard = __ds_scope.BlogCard;

__ds_ns.OverlayCard = __ds_scope.OverlayCard;

__ds_ns.PackageCard = __ds_scope.PackageCard;

__ds_ns.ServiceCard = __ds_scope.ServiceCard;

__ds_ns.TestimonialCard = __ds_scope.TestimonialCard;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Divider = __ds_scope.Divider;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

})();
