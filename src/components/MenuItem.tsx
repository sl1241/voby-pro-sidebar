import classnames from 'classnames';
import { useMenu } from '../hooks/useMenu';
import { menuClasses } from '../utils/utilityClasses';
import { MenuButton } from './MenuButton';
import { LevelContext } from './Menu';
import { SidebarContext } from './Sidebar';
import { useContext } from 'voby';

export interface MenuItemProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'prefix'> {
  /**
   * The icon to be displayed in the menu item
   */
  icon?: React.ReactNode;

  /**
   * The prefix to be displayed in the menu item
   */
  prefix?: React.ReactNode;

  /**
   * The suffix to be displayed in the menu item
   */
  suffix?: React.ReactNode;

  /**
   * If set to true, the menu item will have an active state
   * @default ```false```
   */
  active?: boolean;

  /**
   * If set to true, the menu item will be disabled
   * @default ```false```
   */
  disabled?: boolean;

  /**
   * The component to be rendered as the menu item button
   */
  component?: string | React.ReactElement;

  /**
   * Apply styles from the root element
   */
  rootStyles?: CSSObject;

  children?: React.ReactNode;
}

// interface StyledMenuItemProps extends Pick<MenuItemProps, 'rootStyles' | 'active' | 'disabled'> {
//   level: number;
//   menuItemStyles?: CSSObject;
//   collapsed?: boolean;
//   rtl?: boolean;
//   buttonStyles?: CSSObject;
// }

type MenuItemElement = 'root' | 'button' | 'label' | 'prefix' | 'suffix' | 'icon';

// const StyledMenuItem = styled.li<StyledMenuItemProps>`
//   width: 100%;
//   position: relative;

//   ${({ menuItemStyles }) => menuItemStyles};

//   ${({ rootStyles }) => rootStyles};

//   [&_.ps-menu-button]> .${menuClasses.button} {
//     ${({ level, disabled, active, collapsed, rtl }) =>
//       menuButtonStyles({
//         level,
//         disabled,
//         active,
//         collapsed,
//         rtl,
//       })};

//     ${({ buttonStyles }) => buttonStyles};
//   }
// `;

export const MenuItemFR = (
  {
    children,
    icon,
    className,
    prefix,
    suffix,
    active = false,
    disabled = false,
    component,
    rootStyles,
    ref,
    ...rest
  }: MenuItemProps,
) => {
  const level = useContext(LevelContext);
  const { collapsed, rtl, transitionDuration } = useContext(SidebarContext);
  const { menuItemStyles } = useMenu();
  const getMenuItemStyles = (element: MenuItemElement): CSSObject | undefined => {
    if (menuItemStyles) {
      const params = { level, disabled, active, isSubmenu: false };
      const {
        root: rootElStyles,
        button: buttonElStyles,
        label: labelElStyles,
        icon: iconElStyles,
        prefix: prefixElStyles,
        suffix: suffixElStyles,
      } = menuItemStyles;

      switch (element) {
        case 'root':
          return typeof rootElStyles === 'function' ? rootElStyles(params) : rootElStyles;

        case 'button':
          return typeof buttonElStyles === 'function' ? buttonElStyles(params) : buttonElStyles;

        case 'label':
          return typeof labelElStyles === 'function' ? labelElStyles(params) : labelElStyles;

        case 'icon':
          return typeof iconElStyles === 'function' ? iconElStyles(params) : iconElStyles;

        case 'prefix':
          return typeof prefixElStyles === 'function' ? prefixElStyles(params) : prefixElStyles;

        case 'suffix':
          return typeof suffixElStyles === 'function' ? suffixElStyles(params) : suffixElStyles;

        default:
          return undefined;
      }
    }
  };

  const sharedClasses = {
    [menuClasses.active]: active,
    [menuClasses.disabled]: disabled,
  };

  return (
    <li
      ref={ref}
      style={{
        paddingLeft: rtl ? "20px" : `${level === 0 ? 20 : (collapsed ? level : level + 1) * 20}px`,
        paddingRight: rtl ? ` ${level === 0 ? 20 : (collapsed ? level : level + 1) * 20}px` : "20px"
      }}
      className={[
        menuClasses.menuItemRoot,
        sharedClasses,
        className,
        getMenuItemStyles('root'),
        getMenuItemStyles("button"),
        rootStyles,
        `w-full relative
        [&_.ps-menu-button]>:    
        flex 
        items-center 
        h-[50px] 
        no-underline
        text-inherit
        box-border
        cursor-pointer
        hover:bg-[#f3f3f3]
        ${disabled ? `pointer-events-none cursor-default color-[#adadad]` : ""}
        ${active ? 'background-color: #e2eef9' : ""}

        `
      ]}
      disabled={disabled}
    >
      <MenuButton
        className={classnames(menuClasses.button, sharedClasses)}
        data-testid={`${menuClasses.button}-test-id`}
        component={component}
        tabIndex={0}
        {...rest}
      >
        {icon && (
          <span
            style={{
              marginLeft: rtl ? "10px" : "",
              marginRight: rtl ? "" : "10px"
            }}
            className={[
              menuClasses.icon,
              sharedClasses,
              getMenuItemStyles('icon')
                `w-[35px]
              min-w-[35px]
              h-[35px]
              leading-[35px]
              text-center
              rounded-[2px]
              flex
              items-center
              justify-center
              `
            ]}
          >
            {icon}
          </span>
        )}

        {prefix && (
          <span
            style={{
              marginLeft: rtl ? "5px" : "",
              marginRight: rtl ? "" : "5px",
              opacity: (level === 0 && collapsed) ? '0' : '1',
              transition: `opacity  ${transitionDuration}ms`
            }}
            className={[
              menuClasses.prefix,
              sharedClasses,
              getMenuItemStyles('prefix')
            ]}

          >
            {prefix}
          </span>
        )}

        <span
          className={[
            menuClasses.label,
            sharedClasses,
            getMenuItemStyles('label'),
            `grow
            overflow-hidden
            text-ellipsis	
            whitespace-nowrap	
            `
          ]}
        >
          {children}
        </span>

        {suffix && (
          <span
            style={{
              opacity: (level === 0 && collapsed) ? '0' : '1',
              transition: `opacity  ${transitionDuration}ms`

            }}
            className={[
              menuClasses.suffix,
              sharedClasses,
              getMenuItemStyles('suffix'),
              `mr-[5px]
              ml-[5px]
              `

            ]}
          >
            {suffix}
          </span>
        )}
      </MenuButton>
    </li>
  );
};

export const MenuItem = (MenuItemFR);
