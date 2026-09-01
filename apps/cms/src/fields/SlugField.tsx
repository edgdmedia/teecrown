'use client'

import type { TextFieldClientProps } from 'payload'

import { TextInput, useDocumentInfo, useField, useFormFields } from '@payloadcms/ui'
import React, { useCallback, useEffect, useRef } from 'react'

import { slugify } from './slugify'

/**
 * Slug input that mirrors the title as you type, and stops the moment you edit
 * it yourself.
 *
 * Two deliberate limits:
 *
 * - Only on new documents. Rewriting the slug of a published post because
 *   someone fixed a typo in its title would silently change its public URL and
 *   orphan the old one. Existing documents keep their slug unless you edit it.
 * - Only while untouched. Once you type in the field it is yours; the title can
 *   change freely afterwards without clobbering it.
 *
 * The server-side `beforeValidate` hook in ./slug.ts still runs regardless, so
 * a slug left blank is filled in on save even if this component never mounts.
 */
export const SlugField: React.FC<TextFieldClientProps> = ({ field, path, readOnly }) => {
  const { setValue, showError, value } = useField<string>({ path })
  const { id } = useDocumentInfo()

  const title = useFormFields(([fields]) => {
    const raw = fields?.title?.value
    return typeof raw === 'string' ? raw : ''
  })

  // What we last generated, so we can tell our own value from a hand-typed one.
  const lastGenerated = useRef<null | string>(null)
  const editedByHand = useRef(false)

  const isNewDocument = !id

  useEffect(() => {
    if (!isNewDocument || readOnly || editedByHand.current) return

    const next = slugify(title)
    if (next === value) return

    // Only overwrite an empty field or something we put there ourselves.
    if (!value || value === lastGenerated.current) {
      lastGenerated.current = next
      setValue(next)
    }
  }, [title, value, isNewDocument, readOnly, setValue])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      editedByHand.current = true
      setValue(e.target.value)
    },
    [setValue],
  )

  return (
    <TextInput
      description={field?.admin?.description}
      label={field?.label}
      onChange={handleChange}
      path={path}
      readOnly={readOnly}
      required={field?.required}
      showError={showError}
      value={value ?? ''}
    />
  )
}
