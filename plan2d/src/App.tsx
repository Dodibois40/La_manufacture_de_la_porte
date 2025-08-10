import { useEffect, useRef, useState } from 'react'
import './index.css'

const LOGO_URL = 'https://firebasestorage.googleapis.com/v0/b/site-web-commande-panneaux.firebasestorage.app/o/Logo%2FSans-titre---2-%5BR%C3%A9cup%C3%A9r%C3%A9%5D.png?alt=media&token=857a8d48-d4a3-4533-86a5-2d62067b963e'

type TokenSpec = { id: string; label: string }

const TOKEN_SPECS: TokenSpec[] = [
  { id: 'OUVERTURE_L', label: 'Ouverture L (mm)' },
  { id: 'PORTE_L', label: 'Porte L (mm)' },
  { id: 'PASSAGE_L', label: 'Passage L (mm)' },
  { id: 'CLOISON_E', label: 'Épaisseur cloison (mm)' },
  { id: 'JEU_LAT', label: 'Jeu latéral (mm)' },
  { id: 'JEU_HAUT', label: 'Jeu haut (mm)' },
  { id: 'JEU_BAS', label: 'Jeu bas (mm)' },
  { id: 'JAMBAGE_L', label: 'Jambage (mm)' },
  { id: 'PORTE_E', label: 'Épaisseur porte (mm)' },
  { id: 'PASSAGE_NET', label: 'Passage net (mm)' },
  { id: 'COUVRE_JOINT_L', label: 'Largeur couvre-joint cadre (mm)' },
  { id: 'COUVRE_JOINT_E', label: 'Épaisseur couvre-joint (mm) (20–30)' },
  { id: 'CADRE_E', label: 'Épaisseur cadre (mm)' },
]

const CJ_MIN = 20
const CJ_MAX = 30

// Règles de liaison largeurs
const OPENING_MINUS_DOOR = 86  // ouverture = porte + 86
const DOOR_MINUS_PASSAGE = 26  // passage = porte - 26

type WidthKey = 'OUVERTURE_L' | 'PORTE_L' | 'PASSAGE_L'

function replaceFirstNumber(text: string, newNumber: string): string {
  const re = /(\d+(?:\.\d+)?)/
  if (!re.test(text)) return text
  return text.replace(re, newNumber)
}

function extractFirstNumber(text: string): string | null {
  const m = text.match(/(\d+(?:\.\d+)?)/)
  return m ? m[1] : null
}

function toNumber(value: string | undefined, fallback?: number): number | undefined {
  if (value == null || value === '') return fallback
  const n = Number((value + '').replace(',', '.'))
  return Number.isFinite(n) ? n : fallback
}

function clampCouvreJoint(n: number): number {
  if (!Number.isFinite(n)) return CJ_MIN
  return Math.min(CJ_MAX, Math.max(CJ_MIN, n))
}

function getImageHref(el: Element): string | null {
  // href peut être sur 'href' (SVG2) ou 'xlink:href' (SVG1.1)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyEl = el as any
  return (
    el.getAttribute('href') ||
    el.getAttribute('xlink:href') ||
    (anyEl?.href?.baseVal ?? null) ||
    (anyEl?.['xlink:href']?.baseVal ?? null)
  )
}

function recomputeLinkedWidths(values: Record<string,string>, source: WidthKey): Record<string,string> {
  const next = { ...values }
  const v = toNumber(next[source])
  if (v == null) return next
  if (source === 'PORTE_L') {
    next['OUVERTURE_L'] = String(v + OPENING_MINUS_DOOR)
    next['PASSAGE_L'] = String(v - DOOR_MINUS_PASSAGE)
  } else if (source === 'OUVERTURE_L') {
    const door = v - OPENING_MINUS_DOOR
    next['PORTE_L'] = String(door)
    next['PASSAGE_L'] = String(door - DOOR_MINUS_PASSAGE)
  } else if (source === 'PASSAGE_L') {
    const door = v + DOOR_MINUS_PASSAGE
    next['PORTE_L'] = String(door)
    next['OUVERTURE_L'] = String(door + OPENING_MINUS_DOOR)
  }
  return next
}

export default function App() {
  const [svgString, setSvgString] = useState<string>('')
  const svgDocRef = useRef<Document | null>(null)

  const [values, setValues] = useState<Record<string, string>>({ OUVERTURE_L: '902', COUVRE_JOINT_E: String(CJ_MIN) })
  const [presentIds, setPresentIds] = useState<Set<string>>(new Set<string>())
  const [warning, setWarning] = useState<string>('')
  const [zoom, setZoom] = useState<number>(1)
  const [autoCadre, setAutoCadre] = useState<boolean>(true)
  const [linkWidths, setLinkWidths] = useState<boolean>(true)
  const [widthSource, setWidthSource] = useState<WidthKey>('PORTE_L')

  function onOpenFile(file: File) {
    setWarning('')
    file.text().then(text => {
      const doc = new DOMParser().parseFromString(text, 'image/svg+xml')
      svgDocRef.current = doc

      // Détecter images non intégrées
      const images = Array.from(doc.getElementsByTagName('image'))
      const externals = images.filter(img => {
        const href = getImageHref(img)
        return href != null && !href.startsWith('data:')
      })
      if (externals.length > 0) {
        setWarning('Images non intégrées détectées (motifs/Textures). Exportez en « Intégrer les images » dans Illustrator.')
      }

      // Détecter tokens présents et pré-remplir valeurs
      const newPresent = new Set<string>()
      const newValues: Record<string, string> = { ...values }
      for (const spec of TOKEN_SPECS) {
        const node = doc.getElementById(spec.id) as (SVGTextElement | null)
        if (node) {
          newPresent.add(spec.id)
          const tspans = Array.from(node.getElementsByTagName('tspan'))
          const target = tspans.find(t => /\d/.test(t.textContent ?? '')) ?? node
          const current = target.textContent ?? ''
          const n = extractFirstNumber(current)
          if (n !== null) newValues[spec.id] = n
        }
      }
      // Valeur par défaut + clamp couvre-joint
      const cj = clampCouvreJoint(toNumber(newValues['COUVRE_JOINT_E'], CJ_MIN)!)
      newValues['COUVRE_JOINT_E'] = String(cj)

      // Liaison largeurs si activée et si source présente
      if (linkWidths && ['OUVERTURE_L','PORTE_L','PASSAGE_L'].some(id => newPresent.has(id))) {
        if (newValues[widthSource] != null) {
          Object.assign(newValues, recomputeLinkedWidths(newValues, widthSource))
        }
      }

      // Calcul auto CADRE_E à l’ouverture si activé
      if (autoCadre && (newPresent.has('CADRE_E'))) {
        const cl = toNumber(newValues['CLOISON_E'])
        if (cl != null) {
          newValues['CADRE_E'] = String(cl + 2 * cj)
        }
      }

      setPresentIds(newPresent)
      setValues(newValues)

      const serialized = new XMLSerializer().serializeToString(doc.documentElement)
      setSvgString(serialized)
    }).catch(() => {
      setWarning('Erreur de lecture du fichier SVG.')
    })
  }

  function apply() {
    const doc = svgDocRef.current
    if (!doc) return

    let anyFound = false
    for (const spec of TOKEN_SPECS) {
      if (!presentIds.has(spec.id)) continue
      const node = doc.getElementById(spec.id) as (SVGTextElement | null)
      if (!node) continue
      anyFound = true

      const tspans = Array.from(node.getElementsByTagName('tspan'))
      const target: Element = tspans.find(t => /\d/.test(t.textContent ?? '')) ?? node
      const content = target.textContent ?? ''
      const val = (values[spec.id] ?? '').trim()
      if (!val) continue
      const newText = replaceFirstNumber(content, val)
      target.textContent = newText
    }

    if (!anyFound) setWarning('Aucun token reconnu dans ce SVG.')
    const serialized = new XMLSerializer().serializeToString(doc.documentElement)
    setSvgString(serialized)
  }

  function download() {
    const doc = svgDocRef.current
    if (!doc) return

    // Cloner le SVG pour ajouter un fond sans toucher à l’aperçu
    const original = new XMLSerializer().serializeToString(doc.documentElement)
    const tmpDoc = new DOMParser().parseFromString(original, 'image/svg+xml')
    const svgEl = tmpDoc.documentElement as unknown as SVGSVGElement

    // Calculer la zone (viewBox prioritaire)
    const vb = svgEl.getAttribute('viewBox')
    let x = 0, y = 0, w = 0, h = 0
    if (vb) {
      const parts = vb.split(/[\s,]+/).map(n => Number(n))
      x = parts[0] || 0
      y = parts[1] || 0
      w = parts[2] || 0
      h = parts[3] || 0
    }
    if (!w || !h) {
      const wAttr = svgEl.getAttribute('width') || '0'
      const hAttr = svgEl.getAttribute('height') || '0'
      w = parseFloat(wAttr) || 1000
      h = parseFloat(hAttr) || 600
    }

    // Insérer un fond (gris sombre comme l’app)
    const bg = tmpDoc.createElementNS('http://www.w3.org/2000/svg', 'rect')
    bg.setAttribute('x', String(x))
    bg.setAttribute('y', String(y))
    bg.setAttribute('width', String(w))
    bg.setAttribute('height', String(h))
    bg.setAttribute('fill', '#1A1A1A')
    svgEl.insertBefore(bg, svgEl.firstChild)

    const s = new XMLSerializer().serializeToString(svgEl)
    const blob = new Blob([s], { type: 'image/svg+xml;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'plan_modifie.svg'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  function onFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) onOpenFile(f)
  }

  function recomputeCadreIfNeeded(next: Record<string, string>): Record<string, string> {
    if (!autoCadre) return next
    if (!presentIds.has('CADRE_E')) return next
    const cj = clampCouvreJoint(toNumber(next['COUVRE_JOINT_E'], CJ_MIN)!)
    const cl = toNumber(next['CLOISON_E'])
    if (cl != null) {
      return { ...next, COUVRE_JOINT_E: String(cj), CADRE_E: String(cl + 2 * cj) }
    }
    return { ...next, COUVRE_JOINT_E: String(cj) }
  }

  function onChangeValue(id: string, v: string) {
    let next = { ...values, [id]: v }

    // Clamp couvre-joint et recalcul CADRE_E si besoin
    if (id === 'COUVRE_JOINT_E') {
      const cj = clampCouvreJoint(toNumber(v, CJ_MIN)!)
      next = { ...next, COUVRE_JOINT_E: String(cj) }
    }

    // Liaison largeurs
    if (linkWidths && (id === 'OUVERTURE_L' || id === 'PORTE_L' || id === 'PASSAGE_L')) {
      next = recomputeLinkedWidths(next, id as WidthKey)
    }

    const withCalc = (id === 'CLOISON_E' || id === 'COUVRE_JOINT_E') ? recomputeCadreIfNeeded(next) : next
    setValues(withCalc)
  }

  useEffect(() => {
    // Recalcul si on active le mode auto CADRE
    if (autoCadre) setValues(prev => recomputeCadreIfNeeded(prev))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoCadre])

  useEffect(() => {
    // Changement de source: recalcule si liaison active
    if (linkWidths) {
      setValues(prev => recomputeLinkedWidths(prev, widthSource))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widthSource, linkWidths])

  const visibleSpecs = TOKEN_SPECS.filter(s => presentIds.has(s.id))
  const showWidthLinker = ['OUVERTURE_L','PORTE_L','PASSAGE_L'].some(id => presentIds.has(id))

  return (
    <div className="app">
      <header className="app-header">
        <img src={LOGO_URL} alt="Logo" className="logo"/>
        <h1>La Manufacture de la porte intérieur</h1>
      </header>

      <div className="layout">
        <aside className="side">
          <div className="field">
            <label className="label">Ouvrir SVG</label>
            <input type="file" accept="image/svg+xml" onChange={onFileInput} />
          </div>

          {showWidthLinker && (
            <div className="field">
              <label className="label">Lier Ouverture/Porte/Passage</label>
              <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
                <input type="checkbox" checked={linkWidths} onChange={e => setLinkWidths(e.target.checked)} />
                <span style={{ color:'var(--text-2)', fontSize:12 }}>Basé sur</span>
                <select value={widthSource} onChange={e => setWidthSource(e.target.value as WidthKey)} disabled={!linkWidths}>
                  <option value="PORTE_L">Porte</option>
                  <option value="OUVERTURE_L">Ouverture</option>
                  <option value="PASSAGE_L">Passage</option>
                </select>
                <span style={{ color:'var(--text-2)', fontSize:12 }}>
                  Règles: Ouverture = Porte + 86, Passage = Porte - 26
                </span>
              </div>
            </div>
          )}

          {presentIds.has('CADRE_E') && (
            <div className="field">
              <label className="label">CADRE_E automatique</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={autoCadre} onChange={e => setAutoCadre(e.target.checked)} />
                <span style={{ color: 'var(--text-2)', fontSize: 12 }}>= CLOISON_E + 2 × COUVRE_JOINT_E (20–30)</span>
              </div>
            </div>
          )}

          {visibleSpecs.map(spec => {
            const underlineClass =
              spec.id === 'OUVERTURE_L' ? 'u-green' :
              spec.id === 'CLOISON_E' ? 'u-green' :
              spec.id === 'PORTE_L' ? 'u-red' :
              spec.id === 'PASSAGE_L' ? 'u-yellow' :
              (spec.id === 'COUVRE_JOINT_L' || spec.id === 'COUVRE_JOINT_E' || spec.id === 'CADRE_E') ? 'u-blue' : ''
            return (
            <div className="field" key={spec.id}>
              <label className="label">{spec.label}</label>
              <div className={`label-underline ${underlineClass}`}></div>
              <input
                type="number"
                step="0.1"
                min={spec.id === 'COUVRE_JOINT_E' ? CJ_MIN : undefined}
                max={spec.id === 'COUVRE_JOINT_E' ? CJ_MAX : undefined}
                value={values[spec.id] ?? ''}
                onChange={e => onChangeValue(spec.id, e.target.value)}
                onBlur={apply}
                disabled={autoCadre && spec.id === 'CADRE_E'}
              />
            </div>
          )})}

          <div className="field">
            <label className="label">Zoom</label>
            <div className="zoom-row">
              <button type="button" onClick={() => setZoom(z => Math.max(0.25, +(z - 0.1).toFixed(2)))}>-</button>
              <span className="zoom-val">{Math.round(zoom * 100)}%</span>
              <button type="button" onClick={() => setZoom(z => Math.min(4, +(z + 0.1).toFixed(2)))}>+</button>
              <button type="button" className="ghost" onClick={() => setZoom(1)}>100%</button>
            </div>
          </div>

          <div className="actions">
            <button type="button" onClick={apply}>Appliquer</button>
            <button type="button" onClick={download} disabled={!svgString}>Télécharger SVG</button>
          </div>

          {warning && <div className="warn">{warning}</div>}

          <div className="note">
            - Remplacement: chiffres uniquement, unités conservées.
            <br />- COUVRE_JOINT_E borné entre 20 et 30 mm.
            <br />- CADRE_E auto = CLOISON_E + 2 × COUVRE_JOINT_E.
            <br />- Largeurs liées: Ouverture = Porte + 86, Passage = Porte - 26.
            <br />- Si des motifs/Textures n’apparaissent pas, exportez en « Images: Intégrer » dans Illustrator.
          </div>
        </aside>

        <main className="preview-wrap">
          <div
            className="preview"
            style={{ transform: `scale(${zoom})` }}
            dangerouslySetInnerHTML={{ __html: svgString || '<div class="placeholder">Aucun SVG chargé</div>' }}
          />
        </main>
      </div>
    </div>
  )
}
