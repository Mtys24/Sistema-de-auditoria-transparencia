const mongoose = require('mongoose');
require('dotenv').config();

// Mapeo de Modelos (para el seed usamos esquemas locales si no queremos importar todo)
const CategorySchema = new mongoose.Schema({ name: String, order: Number, code: String });
const SubcategorySchema = new mongoose.Schema({
  name: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  order: Number,
  code: String
});
const ItemSchema = new mongoose.Schema({
  name: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' },
  status: { type: String, default: 'Incompleto' },
  tag: String,
  detail: String,
  deadline: String,
  areas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Area' }],
  order: Number
});
const AreaSchema = new mongoose.Schema({ name: String });

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const Subcategory = mongoose.models.Subcategory || mongoose.model('Subcategory', SubcategorySchema);
const Item = mongoose.models.Item || mongoose.model('Item', ItemSchema);
const Area = mongoose.models.Area || mongoose.model('Area', AreaSchema);

const structure = [
  {
    cat: "01. Actos y documentos publicados en Diario Oficial",
    subs: [
      {
        name: "Actos y documentos del organismo que hayan sido objeto de publicación en el Diario Oficial",
        items: [
          { name: "Actos y documentos del organismo publicados en el Diario Oficial", status: "Completo", tag: "Completado", detail: "Falta publicación de enero, febrero y marzo 2026.", areas: ["Municipal", "Salud", "Educación"] }
        ]
      }
    ]
  },
  {
    cat: "02. Potestades y Marco Normativo",
    subs: [
      {
        name: "Marco Normativo",
        items: [
          { name: "Marco normativo", status: "Completo", tag: "Completado", detail: "Publicado correctamente.", areas: ["Municipal"] }
        ]
      },
      {
        name: "Potestades, competencias, facultades, atribuciones y tareas",
        items: [
          { name: "Potestades y atribuciones del organismo", status: "Completo", tag: "Completado", detail: "Información disponible y al día.", areas: ["Municipal"] },
          { name: "Facultades de unidades internas", status: "Completo", tag: "Completado", detail: "Información completa.", areas: ["Municipal"] }
        ]
      }
    ]
  },
  {
    cat: "03. Estructura orgánica y facultades, funciones y atribuciones",
    subs: [
      { name: "Organigrama", items: [{ name: "Organigrama", status: "Completo", tag: "Completado", detail: "Publicado correctamente.", areas: ["Municipal"] }] },
      { name: "Facultades, funciones y atribuciones de sus unidades u órganos internos", items: [] },
      { name: "Estructura orgánica de Transparencia", items: [{ name: "Estructura orgánica de Transparencia y Protección de Datos", status: "Incompleto", tag: "Incompleto", detail: "No está publicado en la página de Transparencia Activa. Requerido por el Consejo para la Transparencia.", areas: ["Municipal"] }] }
    ]
  },
  {
    cat: "04. Personal y remuneraciones",
    subs: [
      { name: "Personal a Contrata", items: [{ name: "Personal a contrata", status: "Completo", tag: "Completado", detail: "Municipal y Salud faltan datos de marzo. Educación sí cuenta con marzo.", areas: ["Municipal", "Salud", "Educación"] }] },
      { name: "Personal de Planta", items: [{ name: "Personal de planta", status: "Completo", tag: "Completado", detail: "Municipal y Salud faltan datos de marzo. Educación sí cuenta con marzo.", areas: ["Municipal", "Salud", "Educación"] }] },
      { name: "Información estadística sobre bonificaciones", items: [{ name: "Información estadística sobre bonificaciones", status: "Completo", tag: "Completado", detail: "Municipal y Educación no están actualizados a marzo 2026.", areas: ["Municipal", "Educación"] }] },
      { name: "Viáticos percibidos", items: [] },
      { name: "Personal sujeto al Código de Trabajo", items: [{ name: "Personal sujeto al Código del Trabajo (Educación — Jardines VTF)", status: "Completo", tag: "Completado", detail: "En Educación: Jardines VTF falta febrero y marzo 2026. Municipal y Salud también faltan datos de marzo.", areas: ["Educación"] }] },
      { name: "Personas naturales contratadas a honorarios", items: [{ name: "Personas naturales contratadas a honorarios", status: "Completo", tag: "Completado", detail: "Municipal y Educación no están actualizados a marzo 2026. Educación no tiene publicado el año 2026.", areas: ["Municipal", "Educación"] }] },
      { name: "Autoridades de elección popular u otra forma de designación", items: [{ name: "Autoridades de elección popular o designación", status: "Completo", tag: "Completado", detail: "Publicado correctamente.", areas: ["Municipal"] }] },
      { name: "Escala de Remuneraciones", items: [{ name: "Escalas de remuneraciones", status: "Completo", tag: "Completado", detail: "Información disponible y al día.", areas: ["Municipal"] }] }
    ]
  },
  {
    cat: "05. Adquisiciones y contrataciones",
    subs: [
      { name: "Sistema de Compras Públicas", items: [{ name: "Compras menores a 3 UTM", status: "Completo", tag: "Completado", detail: "Municipal, Educación y Salud no están actualizados a marzo 2026.", areas: ["Municipal", "Salud", "Educación"] }, { name: "Contratos formalizados mediante la emisión de orden de compra", status: "Faltante", tag: "No disponible", detail: "Municipal, Educación y Salud no están actualizados a marzo 2026.", areas: ["Municipal", "Salud", "Educación"] }, { name: "Contrataciones fuera de Compras Públicas — bienes y servicios", status: "Completo", tag: "Completado", detail: "Corregido tras auditoría anterior donde no estaba publicado.", areas: ["Municipal"] }] },
      { name: "Licitaciones Publicas y Privadas", items: [{ name: "Licitaciones Públicas y Privadas", status: "Completo", tag: "Completado", detail: "Municipal y Educación no están actualizados a marzo 2026.", areas: ["Municipal", "Educación"] }] },
      { name: "Contrataciones relativas a Bienes Inmuebles y Otras Compras", items: [{ name: "Contrataciones relativas a bienes inmuebles", status: "Incompleto", tag: "Revisar", detail: "Aparece completa, pero verificar vigencia de la información.", areas: ["Municipal"] }] }
    ]
  },
  {
    cat: "06. Transferencias de fondos y aportes económicos entregados",
    subs: [
      { name: "Transferencias re", items: [{ name: "Transferencias Ley N°19.862", status: "Completo", tag: "Completado", detail: "Enlace con comportamiento raro al momento de revisión.", areas: ["Municipal"] }] },
      { name: "Otras transferencias", items: [{ name: "Otras transferencias", status: "Faltante", tag: "Sin datos 2026", detail: "No hay información del año 2026.", areas: ["Municipal"] }] }
    ]
  },
  {
    cat: "07. Actos y resoluciones con efectos sobre terceras personas",
    subs: [
      {
        name: "Actos y resoluciones con efectos sobre terceras personas",
        items: [
          { name: "Órdenes de Pago", status: "Completo", tag: "Completado", detail: "No está actualizado a marzo 2026.", areas: ["Municipal"] },
          { name: "Decretos de Pago", status: "Faltante", tag: "No actualizado", detail: "Educación y Municipal no están actualizados a marzo 2026.", areas: ["Municipal", "Educación"] },
          { name: "Horario de carga y descarga", status: "Completo", tag: "Completado", detail: "No está actualizado a marzo 2026.", areas: ["Municipal"] },
          { name: "Trámites y requisitos para acceso a servicios", status: "Incompleto", tag: "Sin confirmar", detail: "Duda sobre si el ítem está efectivamente creado.", areas: ["Municipal"] }
        ]
      }
    ]
  },
  {
    cat: "09. Subsidios y beneficios",
    subs: [
      { name: "Subsidios y Beneficios como Intermediario", items: [{ name: "Subsidios y beneficios propios", status: "Faltante", tag: "No actualizado", detail: "No está actualizado a marzo 2026.", areas: ["Municipal"] }, { name: "Subsidios y beneficios como intermediario", status: "Faltante", tag: "No actualizado", detail: "No está actualizado a marzo 2026.", areas: ["Municipal"] }] },
      { name: "Nómina de Beneficiarios", items: [{ name: "Nómina de beneficiarios", status: "Incompleto", tag: "Incompleto", detail: "No está actualizado a marzo 2026. Faltan sub-ítems de 2026 en todas las sub-carpetas.", areas: ["Municipal"] }] }
    ]
  },
  {
    cat: "10. Mecanismos de participación ciudadana",
    subs: [
      { name: "Actas de los mecanismos de participación ciudadana", items: [{ name: "Actas de los mecanismos de participación ciudadana", status: "Completo", tag: "Completado", detail: "No está actualizado a marzo 2026. Actas Consejo de Seguridad Pública falta 2026. Actas Oficina Local de la Niñez falta 2025 y 2026.", areas: ["Municipal", "Salud", "Educación"] }] },
      { name: "Mecanismos de participación ciudadana en ejecución", items: [{ name: "Mecanismos de participación ciudadana en ejecución", status: "Faltante", tag: "No actualizado", detail: "No está actualizado a marzo 2026. Falta información del año 2026.", areas: ["Municipal"] }] },
      { name: "Consejo Consultivo", items: [{ name: "Consejos consultivos", status: "Faltante", tag: "No actualizado", detail: "No está actualizado a marzo 2026.", areas: ["Municipal"] }, { name: "Consejo Consultivo", status: "Faltante", tag: "No creado", detail: "Ítem no creado en Transparencia Activa. No está actualizado a marzo 2026.", areas: ["Municipal"] }, { name: "Norma de participación ciudadana", status: "Completo", tag: "Completado", detail: "Publicada correctamente.", areas: ["Municipal"] }] }
    ]
  },
  {
    cat: "11. Información Presupuestaria",
    subs: [
      { name: "Vehículos del organismo", items: [{ name: "Vehículos del organismo", status: "Incompleto", tag: "Incompleto", detail: "Educación y Municipal no están actualizados a marzo 2026. Solo Salud tiene datos.", areas: ["Municipal", "Educación"] }] },
      { name: "Balance de Ejecuciòn Presupuestaria", items: [{ name: "Balance de ejecución presupuestaria", status: "Completo", tag: "Completado", detail: "Educación no está actualizado a marzo 2026.", areas: ["Educación"] }] },
      { name: "Estado de situación financiera", items: [{ name: "Estado de situación financiera", status: "Completo", tag: "Completado", detail: "Educación no está actualizado a marzo 2026.", areas: ["Educación"] }] },
      { name: "Ejecución Presupuestaria", items: [
          { name: "Pasivos del municipio y de las corporaciones municipales", status: "Completo", tag: "Completado", detail: "Educación no está actualizado a marzo 2026.", areas: ["Educación"] },
          { name: "Ejecución presupuestaria", status: "Completo", tag: "Completado", detail: "Educación no está actualizado a marzo 2026.", areas: ["Educación"] },
          { name: "Balance de comprobación y de saldos agregado", status: "Completo", tag: "Completado", detail: "Educación no está actualizado a marzo 2026.", areas: ["Educación"] },
          { name: "Informe analítico de variaciones de la ejecución presupuestaria", status: "Completo", tag: "Completado", detail: "Educación no está actualizado a marzo 2026.", areas: ["Educación"] },
          { name: "Informe analítico de variaciones de la deuda", status: "Completo", tag: "Completado", detail: "Educación no está actualizado a marzo 2026.", areas: ["Educación"] },
          { name: "Informe analítico de variaciones de la ejecución presupuestaria de iniciativas de inversión", status: "Completo", tag: "Completado", detail: "Educación no está actualizado a marzo 2026.", areas: ["Educación"] },
          { name: "Libro diario municipal", status: "Completo", tag: "Completado", detail: "Educación no está actualizado a marzo 2026.", areas: ["Educación"] }
        ] 
      }
    ]
  },
  {
    cat: "12. Auditorías al ejercicio presupuestario",
    subs: [
      { name: "Auditorías", items: [{ name: "Auditorías internas (Dirección de Control Interna)", status: "Faltante", tag: "No actualizado", detail: "No está actualizado a marzo 2026. Auditorías de Contraloría: completas.", areas: ["Municipal"] }] }
    ]
  },
  {
    cat: "13. Participación en otras entidades",
    subs: [
      { name: "Entidades en que tenga participación o representación el organismo", items: [{ name: "Publicidad de las obligaciones contenidas en la Ley N°20.730", status: "Completo", tag: "Completado", detail: "No está actualizado a marzo 2026. No se encuentra en la página de Transparencia Activa.", areas: ["Municipal"] }, { name: "Informe Anual Subdere", status: "Incompleto", tag: "Incompleto", detail: "No está actualizado a marzo 2026. No se encuentra creado en la página de Transparencia Activa.", areas: ["Municipal"] }] }
    ]
  },
  {
    cat: "14. Otros ítems auditados",
    subs: [
      { name: "Otros ítems", items: [
        { name: "Vínculos con otras entidades", status: "Completo", tag: "Completado", detail: "Referencia completa disponible.", areas: ["Municipal"] },
        { name: "Índice de actos secretos o reservados", status: "Completo", tag: "Completado", detail: "Publicado correctamente.", areas: ["Municipal"] },
        { name: "Sanciones conforme Título VI Ley de Transparencia", status: "Completo", tag: "Completado", detail: "Ítem creado pero sin información para el año 2026.", areas: ["Municipal"] },
        { name: "Obligaciones Ley N°20.880", status: "Completo", tag: "Completado", detail: "Publicada correctamente.", areas: ["Municipal"] }
      ]}
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Sw_auditoria');
    console.log("Conectado a MongoDB...");

    await Category.deleteMany({});
    await Subcategory.deleteMany({});
    await Item.deleteMany({});
    // Mantener las áreas si existen, o crearlas si no
    let municipalArea = await Area.findOne({ name: "Municipal" });
    if (!municipalArea) municipalArea = await Area.create({ name: "Municipal" });
    let educArea = await Area.findOne({ name: "Educación" });
    if (!educArea) educArea = await Area.create({ name: "Educación" });
    let saludArea = await Area.findOne({ name: "Salud" });
    if (!saludArea) saludArea = await Area.create({ name: "Salud" });

    const areaMap = { "Municipal": municipalArea._id, "Educación": educArea._id, "Salud": saludArea._id };

    for (let i = 0; i < structure.length; i++) {
      const s = structure[i];
      const catNum = s.cat.match(/^(\d+)/)?.[1] || (i + 1);
      
      const newCat = await Category.create({
        name: s.cat,
        order: parseInt(catNum),
        code: String(catNum).padStart(2, '0')
      });

      for (let j = 0; j < s.subs.length; j++) {
        const subData = s.subs[j];
        
        const newSub = await Subcategory.create({
          name: subData.name,
          category: newCat._id,
          order: j + 1,
          code: `${newCat.code}.${String(j + 1).padStart(2, '0')}`
        });

        if (subData.items) {
          for (let k = 0; k < subData.items.length; k++) {
            const idata = subData.items[k];
            const itemAreas = (idata.areas || []).map(a => areaMap[a]).filter(x => x);
            
            await Item.create({
              name: idata.name,
              category: newCat._id,
              subcategory: newSub._id,
              status: idata.status || 'Incompleto',
              tag: idata.tag || (idata.status === 'Completo' ? 'Completado' : 'Pendiente'),
              detail: idata.detail || '',
              areas: itemAreas,
              order: k + 1
            });
          }
        }
      }
    }

    console.log("¡Seed Full Structure completado con los datos de auditoría!");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

seed();
