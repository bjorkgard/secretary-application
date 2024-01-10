import React from 'react'

interface FieldProps {
  children: React.ReactNode
  label:    string
  error?:   string
}

export function Field({ children, label, error }: FieldProps): JSX.Element {
  const id = getChildId(children)

  return (
    <div className="form-control w-full">
      <label htmlFor={id} className="label font-bold">
        <span className="label-text">{label}</span>
      </label>
      {children}
      <label className="label">
        {error && <span className="label-text-alt text-red-400">{error}</span>}
      </label>
    </div>
  )
}

// Get id prop from a child element
export function getChildId(children: React.ReactNode): string {
  const child = React.Children.only(children)

  if (React.isValidElement(child) && 'id' in child.props)
    return child.props.id

  return ''
}
