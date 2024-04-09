import { createElement, ReactElement, ReactNode, RefAttributes } from 'react';
import { Control, FieldError } from 'react-hook-form';

export interface ControlProps {
  control?: Control<any>;
  name: string;
  label?: string;
  rules?: any;
  error?: FieldError;
  disabled?: boolean;
}

interface Props {
  children: ReactNode;
  control: Control<any>;
  rules?: any;
  errors: any;
  translate?: (val: string) => string;
  disabled?: boolean;
  onSubmit?: () => void;
  hasFormElement?: boolean;
}

// TODO: auto focus on next input field?
const Form = ({
  children,
  control,
  rules,
  errors,
  translate,
  disabled = false,
  onSubmit,
  hasFormElement = true,
}: Props) => {
  const enrichElements = (elements: ReactNode): ReactElement[] | undefined => {
    if (!elements) return undefined;

    return (Array.isArray(elements) ? [...elements] : [elements]).map((element, i) =>
      enrichElement(element as ReactElement, i),
    );
  };

  const enrichElement = (element: ReactElement & RefAttributes<any>, index: number): ReactElement => {
    if (!element?.props) return element;

    let props = {
      ...element.props,
      children: enrichElements(element.props.children),
      key: index,
    };

    if (element.props.name) {
      const error = element.props.name.split('.').reduce((prev: any, curr: string) => prev?.[curr], errors);

      props = {
        ...props,
        ref: element.ref,
        control: control,
        rules: rules ? rules[element.props.name] : undefined,
        error: error && translate ? { ...error, message: translate(error.message) } : error,
        disabled: element.props.disabled || disabled,
        onSubmit: onSubmit,
      };
    }

    return createElement(element.type, props);
  };

  return hasFormElement ? <form className="w-full">{enrichElements(children)}</form> : <>{enrichElements(children)}</>;
};

export default Form;
