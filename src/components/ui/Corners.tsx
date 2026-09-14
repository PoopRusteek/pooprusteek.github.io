/** The ratatui border wink: box-drawing corners that light up on hover.
 *  Expects a `group` + `relative` parent. */
export default function Corners() {
  const base =
    'pointer-events-none absolute text-line transition-colors group-hover:text-accent-soft text-xs leading-none'
  return (
    <>
      <span aria-hidden className={`${base} top-1 left-1`}>┌</span>
      <span aria-hidden className={`${base} top-1 right-1`}>┐</span>
      <span aria-hidden className={`${base} bottom-1 left-1`}>└</span>
      <span aria-hidden className={`${base} bottom-1 right-1`}>┘</span>
    </>
  )
}
