export const PAQUETES = [
  {
    id: 'celdas_mt',
    label: 'Celdas MT',
    labelFull: 'Celdas de Media Tensión',
    icon: '⚡',
    fields: [
      { key: 'cantidad_celdas', label: 'Cantidad de celdas', type: 'number' },
      { key: 'numero_columnas', label: 'Número de columnas', type: 'number' },
      { key: 'tension_kv', label: 'Tensión (kV)', type: 'number' },
    ],
  },
  {
    id: 'transformadores_mt',
    label: 'Transform. MT',
    labelFull: 'Transformadores de Media Tensión',
    icon: '🔌',
    fields: [
      { key: 'potencia_kva', label: 'Potencia (kVA)', type: 'number' },
      { key: 'cantidad', label: 'Cantidad', type: 'number' },
      { key: 'factor_potencia', label: 'Factor de potencia', type: 'number' },
      { key: 'tipo', label: 'Tipo', type: 'select', options: ['Seco', 'Aceite'] },
    ],
  },
  {
    id: 'tablero_general',
    label: 'Tablero Gral.',
    labelFull: 'Tablero General',
    icon: '🔲',
    fields: [
      { key: 'corriente_maxima', label: 'Corriente máxima (A)', type: 'number' },
      { key: 'corriente_barra', label: 'Corriente de barra (A)', type: 'number' },
      { key: 'ducto_barra_ml', label: 'Ducto de barra (ml)', type: 'number' },
      { key: 'corriente_interruptores', label: 'Corriente interruptores (A)', type: 'number' },
    ],
  },
  {
    id: 'tableros_distribucion',
    label: 'Tableros Dist.',
    labelFull: 'Tableros de Distribución',
    icon: '🗂',
    fields: [
      { key: 'cantidad_tableros', label: 'Cantidad de tableros', type: 'number' },
      { key: 'corriente_maxima', label: 'Corriente máxima (A)', type: 'number' },
    ],
  },
  {
    id: 'ups',
    label: 'UPS',
    labelFull: 'UPS',
    icon: '🔋',
    fields: [
      { key: 'potencia_kva', label: 'Potencia (kVA)', type: 'number' },
      { key: 'cantidad', label: 'Cantidad', type: 'number' },
      { key: 'autonomia_min', label: 'Autonomía (min)', type: 'number' },
    ],
  },
  {
    id: 'tableros_generacion',
    label: 'Generación',
    labelFull: 'Tableros de Generación',
    icon: '🏭',
    fields: [
      { key: 'potencia_kw', label: 'Potencia (kW)', type: 'number' },
      { key: 'cantidad_grupos', label: 'Cantidad de grupos', type: 'number' },
    ],
  },
  {
    id: 'pme',
    label: 'PME',
    labelFull: 'PME — Power Monitoring Expert',
    icon: '📊',
    fields: [
      { key: 'puntos_monitoreo', label: 'Puntos de monitoreo', type: 'number' },
      { key: 'version', label: 'Versión', type: 'text' },
    ],
  },
  {
    id: 'bms',
    label: 'BMS',
    labelFull: 'BMS — Building Management System',
    icon: '🏗',
    fields: [
      { key: 'puntos_bms', label: 'Puntos BMS', type: 'number' },
      { key: 'protocolos', label: 'Protocolos', type: 'text' },
    ],
  },
  {
    id: 'artefactos',
    label: 'Artefactos',
    labelFull: 'Artefactos Eléctricos',
    icon: '💡',
    fields: [
      { key: 'cantidad_placas', label: 'Cantidad de placas', type: 'number' },
      { key: 'interruptores', label: 'Interruptores', type: 'number' },
      { key: 'enchufes', label: 'Enchufes', type: 'number' },
      { key: 'metros_lineales', label: 'Metros lineales', type: 'number' },
    ],
  },
]

export const ETAPAS = [
  'Prospecto',
  'En cotización',
  'Oferta enviada',
  'Negociación',
  'Adjudicado',
  'Perdido',
]

export const ETAPA_COLOR = {
  'Prospecto': '#626469',
  'En cotización': '#42B4E6',
  'Oferta enviada': '#E47F00',
  'Negociación': '#8B5CF6',
  'Adjudicado': '#008029',
  'Perdido': '#DC0A0A',
}

export const ESTADOS_PAQUETE = [
  'Por solicitar',
  'Solicitado',
  'Oferta recibida',
  'En revisión',
  'Cerrado',
]
