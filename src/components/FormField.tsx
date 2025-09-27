import { FC } from 'hono/jsx'

interface FormFieldProps {
  label: string
  name: string
  value: string
  placeholder?: string
  type?: 'text' | 'url'
  required?: boolean
  className?: string
}

export const FormField: FC<FormFieldProps> = ({
  label,
  name,
  value,
  placeholder,
  type = 'text',
  required = false,
  className = ''
}) => {
  return (
    <div class={`form-field ${className}`}>
      <label for={name} class="form-label">
        {label}
        {required && <span class="required">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        class="form-input"
        data-field={name}
      />
    </div>
  )
}
