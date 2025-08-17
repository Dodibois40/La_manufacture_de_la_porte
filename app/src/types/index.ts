export type TokenSpec = { 
  id: string; 
  label: string 
}

export type WidthKey = 'OUVERTURE_L' | 'PORTE_L' | 'PASSAGE_L'

export const TOKEN_SPECS: TokenSpec[] = [
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
