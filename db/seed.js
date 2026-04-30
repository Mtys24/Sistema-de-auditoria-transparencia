require('dotenv').config();
const { connectMongo, Category, Subcategory, Item } = require('./mongo');

const data = [
  {
    name: '01. Actos y documentos publicados en Diario Oficial',
    code: '01',
    order: 1,
    subcategories: [
      'Actos y documentos del organismo que hayan sido objeto de publicación en el Diario Oficial'
    ]
  },
  {
    name: '02. Potestades y Marco Normativo',
    code: '02',
    order: 2,
    subcategories: [
      'Marco Normativo',
      'Potestades, competencias, facultades, atribuciones y tareas'
    ]
  },
  {
    name: '03. Estructura orgánica y facultades, funciones y atribuciones',
    code: '03',
    order: 3,
    subcategories: [
      'Organigrama',
      'Facultades, funciones y atribuciones de sus unidades u órganos internos',
      'Estructura orgánica de Transparencia'
    ]
  },
  {
    name: '04. Personal y remuneraciones',
    code: '04',
    order: 4,
    subcategories: [
      'Personal a Contrata',
      'Personal de Planta',
      'Información estadística sobre bonificaciones',
      'Viáticos percibidos',
      'Personal sujeto al Código de Trabajo',
      'Personas naturales contratadas a honorarios',
      'Autoridades de elección popular u otra forma de designación',
      'Escala de Remuneraciones'
    ]
  },
  {
    name: '05. Adquisiciones y contrataciones',
    code: '05',
    order: 5,
    subcategories: [
      'Sistema de Compras Públicas',
      'Licitaciones Publicas y Privadas',
      'Contrataciones relativas a Bienes Inmuebles y Otras Compras'
    ]
  },
  {
    name: '06. Transferencias de fondos y aportes económicos entregados',
    code: '06',
    order: 6,
    subcategories: [
      'Transferencias reguladas por Ley Nº 19.862',
      'Otras transferencias'
    ]
  },
  {
    name: '07. Actos y resoluciones con efectos sobre terceras personas',
    code: '07',
    order: 7,
    subcategories: [
      'Dirección de Obras Municipales - permisos y autorizaciones del Art. 116 bis C LGUC',
      'Actos y resoluciones con efectos sobre terceras personas (patentes, permisos, derechos, concesiones, concursos)'
    ]
  },
  {
    name: '08. Trámites ante el organismo',
    code: '08',
    order: 8,
    subcategories: [
      'Trámites ante el órgano'
    ]
  },
  {
    name: '09. Subsidios y beneficios',
    code: '09',
    order: 9,
    subcategories: [
      'Subsidios y Beneficios Propios',
      'Subsidios y Beneficios como Intermediario',
      'Nómina de Beneficiarios'
    ]
  },
  {
    name: '10. Mecanismos de participación ciudadana',
    code: '10',
    order: 10,
    subcategories: [
      'Norma General de Participación Ciudadana',
      'Actas de los mecanismos de participación ciudadana',
      'Mecanismos de participación ciudadana en ejecución',
      'Consejo Consultivo',
      'Mecanismos de participación ciudadana'
    ]
  },
  {
    name: '11. Información Presupuestaria',
    code: '11',
    order: 11,
    subcategories: [
      'Vehículos del organismo',
      'Presupuestos asignados y modificaciones',
      'Balance de Ejecución Presupuestaria',
      'Estado de situación financiera',
      'Pasivos del municipio y de las corporaciones municipales',
      'Ejecución Presupuestaria',
      'Balance de comprobación y de saldos agregado',
      'Balance de comprobación y de saldos desagregado',
      'Informe analítico de variaciones de la ejecución presupuestaria',
      'Informe analítico de variaciones de la deuda',
      'Informe analítico de variaciones de la ejecución presupuestaria de iniciativas de inversión',
      'Libro diario municipal'
    ]
  },
  {
    name: '12. Auditorías al ejercicio presupuestario y aclaraciones',
    code: '12',
    order: 12,
    subcategories: [
      'Auditorías'
    ]
  },
  {
    name: '13. Participación en otras entidades',
    code: '13',
    order: 13,
    subcategories: [
      'Entidades en que tenga participación o representación el organismo'
    ]
  },
  {
    name: '14. Antecedentes preparatorios de normas jurídicas generales',
    code: '14',
    order: 14,
    subcategories: [
      'Antecedentes preparatorios de las normas jurídicas generales que afecten a empresas de menor tamaño'
    ]
  },
  {
    name: '15. Lobby y gestión de intereses',
    code: '15',
    order: 15,
    subcategories: [
      'Acceso a sitio Ley de Lobby'
    ]
  },
  {
    name: '16. Declaración de patrimonio e intereses Ley N°20.880',
    code: '16',
    order: 16,
    subcategories: [
      'Declaración de patrimonio e intereses ley N°20.880'
    ]
  },
  {
    name: '17. Informe Anual a la SUBDERE',
    code: '17',
    order: 17,
    subcategories: [
      'Informe Anual a la SUBDERE',
      'Juntas de Vecinos y organizaciones comunitarias - Ley N°21.146',
      'Registros públicos de organizaciones vigentes',
      'Elecciones',
      'Más información y otros trámites'
    ]
  },
  {
    name: 'Sanciones por incumplimiento Ley de Transparencia',
    code: '18',
    order: 18,
    subcategories: [
      'Sanciones por incumplimiento Ley de Transparencia'
    ]
  },
  {
    name: 'Acceso a Información Pública',
    code: '19',
    order: 19,
    subcategories: [
      'Índice de actos y documentos calificados como secretos o reservados',
      'Formulario Solicitudes de Acceso a la Información',
      'Registro Histórico'
    ]
  },
  {
    name: 'Transparencia proactiva',
    code: '20',
    order: 20,
    subcategories: [
      'Memorias Institucionales'
    ]
  },
  {
    name: 'Costos de reproducción',
    code: '21',
    order: 21,
    subcategories: [
      'Costos directos de reproducción de la información solicitada'
    ]
  },
  {
    name: 'Dificultades Técnicas, Visualizadores & Plug-ins',
    code: '22',
    order: 22,
    subcategories: [
      'Dificultades técnicas',
      'Visualizadores & plug-ins'
    ]
  }
];

async function seed() {
  await connectMongo();

  const existingCats = await Category.countDocuments();
  if (existingCats > 0) {
    console.log(`Ya existen ${existingCats} categorías. Ejecuta con --force para sobreescribir.`);
    if (!process.argv.includes('--force')) {
      process.exit(0);
    }
    await Category.deleteMany({});
    await Subcategory.deleteMany({});
    await Item.deleteMany({});
    console.log('Datos anteriores eliminados.');
  }

  let totalItems = 0;

  for (const catData of data) {
    const category = await Category.create({
      name: catData.name,
      code: catData.code,
      order: catData.order
    });

    for (let i = 0; i < catData.subcategories.length; i++) {
      const subName = catData.subcategories[i];
      const subcategory = await Subcategory.create({
        name: subName,
        category: category._id,
        order: i + 1
      });

      await Item.create({
        name: subName,
        category: category._id,
        subcategory: subcategory._id,
        status: 'warn',
        tag: '',
        detail: '',
        prev_observation: '',
        deadline: '',
        areas: []
      });

      totalItems++;
    }
  }

  console.log(`Seed completado: ${data.length} categorías, ${totalItems} ítems creados.`);
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
