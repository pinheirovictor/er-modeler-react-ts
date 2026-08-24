import { useEffect } from 'react'

type KeyboardShortcutOptions = {
  onCopy: () => void
  onPaste: () => void
  onCut: () => void
  onDelete: () => void

  onSelectAll: () => void

  onUndo: () => void
  onRedo: () => void

  onDuplicate: () => void

  onSave: () => void

  onEscape: () => void
}

function isEditingText() {
  const element = document.activeElement

  if (!element) {
    return false
  }

  const tagName =
    element.tagName.toLowerCase()

  return (
    tagName === 'input' ||
    tagName === 'textarea' ||
    tagName === 'select' ||
    (element as HTMLElement).isContentEditable
  )
}

export function useKeyboardShortcuts({
  onCopy,
  onPaste,
  onCut,
  onDelete,

  onSelectAll,

  onUndo,
  onRedo,

  onDuplicate,

  onSave,

  onEscape,
}: KeyboardShortcutOptions) {

  useEffect(() => {

    function handleKeyDown(
      event: KeyboardEvent,
    ) {

      /*
       * Windows/Linux:
       * Ctrl
       *
       * macOS:
       * Command (Meta)
       */
      const modifier =
        event.ctrlKey ||
        event.metaKey

      const key =
        event.key.toLowerCase()

      /*
       * Se estiver digitando em um input,
       * textarea etc., deixamos os atalhos
       * normais do navegador/SO funcionarem.
       */
      if (isEditingText()) {

        /*
         * Escape ainda pode ser utilizado
         * para sair da edição.
         */
        if (event.key === 'Escape') {
          ;(document.activeElement as HTMLElement)
            ?.blur()
        }

        return
      }


      /* =====================================
         COPIAR
         Ctrl+C / Cmd+C
         ===================================== */

      if (
        modifier &&
        key === 'c'
      ) {
        event.preventDefault()

        onCopy()

        return
      }


      /* =====================================
         COLAR
         Ctrl+V / Cmd+V
         ===================================== */

      if (
        modifier &&
        key === 'v'
      ) {
        event.preventDefault()

        onPaste()

        return
      }


      /* =====================================
         RECORTAR
         Ctrl+X / Cmd+X
         ===================================== */

      if (
        modifier &&
        key === 'x'
      ) {
        event.preventDefault()

        onCut()

        return
      }


      /* =====================================
         SELECIONAR TUDO
         Ctrl+A / Cmd+A
         ===================================== */

      if (
        modifier &&
        key === 'a'
      ) {
        event.preventDefault()

        onSelectAll()

        return
      }


      /* =====================================
         DESFAZER
         Ctrl+Z / Cmd+Z
         ===================================== */

      if (
        modifier &&
        key === 'z' &&
        !event.shiftKey
      ) {
        event.preventDefault()

        onUndo()

        return
      }


      /* =====================================
         REFAZER

         Windows/Linux:
         Ctrl+Y

         Windows/Linux/macOS:
         Ctrl/Cmd + Shift + Z
         ===================================== */

      if (
        (
          modifier &&
          key === 'y'
        ) ||
        (
          modifier &&
          event.shiftKey &&
          key === 'z'
        )
      ) {
        event.preventDefault()

        onRedo()

        return
      }


      /* =====================================
         DUPLICAR
         Ctrl+D / Cmd+D
         ===================================== */

      if (
        modifier &&
        key === 'd'
      ) {
        event.preventDefault()

        onDuplicate()

        return
      }


      /* =====================================
         SALVAR
         Ctrl+S / Cmd+S
         ===================================== */

      if (
        modifier &&
        key === 's'
      ) {
        /*
         * Evita que o navegador abra
         * "Salvar página como..."
         */
        event.preventDefault()

        onSave()

        return
      }


      /* =====================================
         EXCLUIR
         Delete / Backspace
         ===================================== */

      if (
        event.key === 'Delete' ||
        event.key === 'Backspace'
      ) {
        event.preventDefault()

        onDelete()

        return
      }


      /* =====================================
         ESCAPE
         ===================================== */

      if (
        event.key === 'Escape'
      ) {
        event.preventDefault()

        onEscape()

        return
      }
    }


    window.addEventListener(
      'keydown',
      handleKeyDown,
    )


    return () => {

      window.removeEventListener(
        'keydown',
        handleKeyDown,
      )
    }

  }, [
    onCopy,
    onPaste,
    onCut,
    onDelete,

    onSelectAll,

    onUndo,
    onRedo,

    onDuplicate,

    onSave,

    onEscape,
  ])
}