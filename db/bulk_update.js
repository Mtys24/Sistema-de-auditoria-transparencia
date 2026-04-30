const { connectMongo, Category, Item, Area, Subcategory } = require('./mongo');

const data = [
  { id: 1, section: "01", catName: "Actos y documentos publicados en Diario Oficial", name: "Actos y documentos del organismo publicados en el Diario Oficial", status: "ok", tag: "Completado", detail: "Falta publicación de enero, febrero y marzo 2026.", deadline: "2026-04-30", areas: ["Municipal", "Salud", "Educación"] },
  { id: 2, section: "02", catName: "Potestades, competencias y atribuciones", name: "Potestades y atribuciones del organismo", status: "ok", tag: "Completado", detail: "Información disponible y al día.", deadline: "", areas: ["Municipal"] },
  { id: 3, section: "02", catName: "Potestades, competencias y atribuciones", name: "Marco normativo", status: "ok", tag: "Completado", detail: "Publicado correctamente.", deadline: "", areas: ["Municipal"] },
  { id: 4, section: "02", catName: "Potestades, competencias y atribuciones", name: "Facultades de unidades internas", status: "ok", tag: "Completado", detail: "Información completa.", deadline: "", areas: ["Municipal"] },
  { id: 5, section: "03", catName: "Estructura orgánica y facultades", name: "Organigrama", status: "ok", tag: "Completado", detail: "Publicado correctamente.", deadline: "", areas: ["Municipal"] },
  { id: 6, section: "03", catName: "Estructura orgánica y facultades", name: "Estructura orgánica de Transparencia y Protección de Datos", status: "warn", tag: "Incompleto", detail: "No está publicado en la página de Transparencia Activa. Requerido por el Consejo para la Transparencia.", deadline: "2026-04-30", areas: ["Municipal"] },
  { id: 7, section: "04", catName: "Personal y remuneraciones", name: "Personal de planta", status: "ok", tag: "Completado", detail: "Municipal y Salud faltan datos de marzo. Educación sí cuenta con marzo.", deadline: "2026-04-30", areas: ["Municipal", "Salud", "Educación"] },
  { id: 8, section: "04", catName: "Personal y remuneraciones", name: "Personal a contrata", status: "ok", tag: "Completado", detail: "Municipal y Salud faltan datos de marzo. Educación sí cuenta con marzo.", deadline: "2026-04-30", areas: ["Municipal", "Salud", "Educación"] },
  { id: 9, section: "04", catName: "Personal y remuneraciones", name: "Personal sujeto al Código del Trabajo (Educación — Jardines VTF)", status: "ok", tag: "Completado", detail: "En Educación: Jardines VTF falta febrero y marzo 2026. Municipal y Salud también faltan datos de marzo.", deadline: "2026-04-30", areas: ["Educación"] },
  { id: 10, section: "04", catName: "Personal y remuneraciones", name: "Personas naturales contratadas a honorarios", status: "ok", tag: "Completado", detail: "Municipal y Educación no están actualizados a marzo 2026. Educación no tiene publicado el año 2026.", deadline: "2026-04-30", areas: ["Municipal", "Educación"] },
  { id: 11, section: "04", catName: "Personal y remuneraciones", name: "Escalas de remuneraciones", status: "ok", tag: "Completado", detail: "Información disponible y al día.", deadline: "", areas: ["Municipal"] },
  { id: 12, section: "04", catName: "Personal y remuneraciones", name: "Información estadística sobre bonificaciones", status: "ok", tag: "Completado", detail: "Municipal y Educación no están actualizados a marzo 2026.", deadline: "2026-04-30", areas: ["Municipal", "Educación"] },
  { id: 13, section: "04", catName: "Personal y remuneraciones", name: "Autoridades de elección popular o designación", status: "ok", tag: "Completado", detail: "Publicado correctamente.", deadline: "", areas: ["Municipal"] },
  { id: 14, section: "05", catName: "Adquisiciones y contrataciones", name: "Licitaciones Públicas y Privadas", status: "ok", tag: "Completado", detail: "Municipal y Educación no están actualizados a marzo 2026.", deadline: "2026-04-30", areas: ["Municipal", "Educación"] },
  { id: 15, section: "05", catName: "Adquisiciones y contrataciones", name: "Compras menores a 3 UTM", status: "ok", tag: "Completado", detail: "Municipal, Educación y Salud no están actualizados a marzo 2026.", deadline: "2026-04-30", areas: ["Municipal", "Salud", "Educación"] },
  { id: 16, section: "05", catName: "Adquisiciones y contrataciones", name: "Contratos formalizados mediante la emisión de orden de compra", status: "bad", tag: "No disponible", detail: "Municipal, Educación y Salud no están actualizados a marzo 2026.", deadline: "2026-04-30", areas: ["Municipal", "Salud", "Educación"] },
  { id: 17, section: "05", catName: "Adquisiciones y contrataciones", name: "Contrataciones fuera de Compras Públicas — bienes y servicios", status: "ok", tag: "Completado", detail: "Corregido tras auditoría anterior donde no estaba publicado.", deadline: "", areas: ["Municipal"] },
  { id: 18, section: "05", catName: "Adquisiciones y contrataciones", name: "Contrataciones relativas a bienes inmuebles", status: "warn", tag: "Revisar", detail: "Aparece completa, pero verificar vigencia de la información.", deadline: "2026-04-30", areas: ["Municipal"] },
  { id: 19, section: "06", catName: "Transferencias", name: "Transferencias Ley N°19.862", status: "ok", tag: "Completado", detail: "Enlace con comportamiento raro al momento de revisión.", deadline: "2026-04-30", areas: ["Municipal"] },
  { id: 20, section: "06", catName: "Transferencias", name: "Otras transferencias", status: "bad", tag: "Sin datos 2026", detail: "No hay información del año 2026.", deadline: "2026-04-30", areas: ["Municipal"] },
  { id: 21, section: "07", catName: "Actos y resoluciones con efectos sobre terceros", name: "Órdenes de Pago", status: "ok", tag: "Completado", detail: "No está actualizado a marzo 2026.", deadline: "2026-04-30", areas: ["Municipal"] },
  { id: 22, section: "07", catName: "Actos y resoluciones con efectos sobre terceros", name: "Decretos de Pago", status: "bad", tag: "No actualizado", detail: "Educación y Municipal no están actualizados a marzo 2026.", deadline: "2026-04-30", areas: ["Municipal", "Educación"] },
  { id: 23, section: "07", catName: "Actos y resoluciones con efectos sobre terceros", name: "Horario de carga y descarga", status: "ok", tag: "Completado", detail: "No está actualizado a marzo 2026.", deadline: "2026-04-30", areas: ["Municipal"] },
  { id: 24, section: "07", catName: "Actos y resoluciones con efectos sobre terceros", name: "Trámites y requisitos para acceso a servicios", status: "warn", tag: "Sin confirmar", detail: "Duda sobre si el ítem está efectivamente creado.", deadline: "2026-04-30", areas: ["Municipal"] },
  { id: 25, section: "09", catName: "Subsidios y beneficios", name: "Subsidios y beneficios propios", status: "bad", tag: "No actualizado", detail: "No está actualizado a marzo 2026.", deadline: "2026-04-30", areas: ["Municipal"] },
  { id: 26, section: "09", catName: "Subsidios y beneficios", name: "Subsidios y beneficios como intermediario", status: "bad", tag: "No actualizado", detail: "No está actualizado a marzo 2026.", deadline: "2026-04-30", areas: ["Municipal"] },
  { id: 27, section: "09", catName: "Subsidios y beneficios", name: "Nómina de beneficiarios", status: "warn", tag: "Incompleto", detail: "No está actualizado a marzo 2026. Faltan sub-ítems de 2026 en todas las sub-carpetas.", deadline: "2026-04-30", areas: ["Municipal"] },
  { id: 28, section: "10", catName: "Mecanismos de participación ciudadana", name: "Actas de los mecanismos de participación ciudadana", status: "ok", tag: "Completado", detail: "No está actualizado a marzo 2026. Actas Consejo de Seguridad Pública falta 2026. Actas Oficina Local de la Niñez falta 2025 y 2026.", deadline: "2026-04-30", areas: ["Municipal", "Salud", "Educación"] },
  { id: 29, section: "10", catName: "Mecanismos de participación ciudadana", name: "Consejos consultivos", status: "bad", tag: "No actualizado", detail: "No está actualizado a marzo 2026.", deadline: "2026-04-30", areas: ["Municipal"] },
  { id: 30, section: "10", catName: "Mecanismos de participación ciudadana", name: "Consejo Consultivo", status: "bad", tag: "No creado", detail: "Ítem no creado en Transparencia Activa. No está actualizado a marzo 2026.", deadline: "2026-04-30", areas: ["Municipal"] },
  { id: 31, section: "10", catName: "Mecanismos de participación ciudadana", name: "Mecanismos de participación ciudadana en ejecución", status: "bad", tag: "No actualizado", detail: "No está actualizado a marzo 2026. Falta información del año 2026.", deadline: "2026-04-30", areas: ["Municipal"] },
  { id: 32, section: "10", catName: "Mecanismos de participación ciudadana", name: "Norma de participación ciudadana", status: "ok", tag: "Completado", detail: "Publicada correctamente.", deadline: "", areas: ["Municipal"] },
  { id: 33, section: "11", catName: "Información presupuestaria", name: "Vehículos del organismo", status: "warn", tag: "Incompleto", detail: "Educación y Municipal no están actualizados a marzo 2026. Solo Salud tiene datos.", deadline: "2026-04-30", areas: ["Municipal", "Educación"] },
  { id: 34, section: "11", catName: "Información presupuestaria", name: "Balance de ejecución presupuestaria", status: "ok", tag: "Completado", detail: "Educación no está actualizado a marzo 2026.", deadline: "2026-04-30", areas: ["Educación"] },
  { id: 35, section: "11", catName: "Información presupuestaria", name: "Estado de situación financiera", status: "ok", tag: "Completado", detail: "Educación no está actualizado a marzo 2026.", deadline: "2026-04-30", areas: ["Educación"] },
  { id: 36, section: "11", catName: "Información presupuestaria", name: "Pasivos del municipio y de las corporaciones municipales", status: "ok", tag: "Completado", detail: "Educación no está actualizado a marzo 2026.", deadline: "2026-04-30", areas: ["Educación"] },
  { id: 37, section: "11", catName: "Información presupuestaria", name: "Ejecución presupuestaria", status: "ok", tag: "Completado", detail: "Educación no está actualizado a marzo 2026.", deadline: "2026-04-30", areas: ["Educación"] },
  { id: 38, section: "11", catName: "Información presupuestaria", name: "Balance de comprobación y de saldos agregado", status: "ok", tag: "Completado", detail: "Educación no está actualizado a marzo 2026.", deadline: "2026-04-30", areas: ["Educación"] },
  { id: 39, section: "11", catName: "Información presupuestaria", name: "Informe analítico de variaciones de la ejecución presupuestaria", status: "ok", tag: "Completado", detail: "Educación no está actualizado a marzo 2026.", deadline: "2026-04-30", areas: ["Educación"] },
  { id: 40, section: "11", catName: "Información presupuestaria", name: "Informe analítico de variaciones de la deuda", status: "ok", tag: "Completado", detail: "Educación no está actualizado a marzo 2026.", deadline: "2026-04-30", areas: ["Educación"] },
  { id: 41, section: "11", catName: "Información presupuestaria", name: "Informe analítico de variaciones de la ejecución presupuestaria de iniciativas de inversión", status: "ok", tag: "Completado", detail: "Educación no está actualizado a marzo 2026.", deadline: "2026-04-30", areas: ["Educación"] },
  { id: 42, section: "11", catName: "Información presupuestaria", name: "Libro diario municipal", status: "ok", tag: "Completado", detail: "Educación no está actualizado a marzo 2026.", deadline: "2026-04-30", areas: ["Educación"] },
  { id: 43, section: "12", catName: "Auditorías al ejercicio presupuestario", name: "Auditorías internas (Dirección de Control Interna)", status: "bad", tag: "No actualizado", detail: "No está actualizado a marzo 2026. Auditorías de Contraloría: completas.", deadline: "2026-04-30", areas: ["Municipal"] },
  { id: 44, section: "13", catName: "Extra", name: "Publicidad de las obligaciones contenidas en la Ley N°20.730", status: "ok", tag: "Completado", detail: "No está actualizado a marzo 2026. No se encuentra en la página de Transparencia Activa.", deadline: "2026-04-30", areas: ["Municipal"] },
  { id: 45, section: "13", catName: "Extra", name: "Informe Anual Subdere", status: "warn", tag: "Incompleto", detail: "No está actualizado a marzo 2026. No se encuentra creado en la página de Transparencia Activa.", deadline: "2026-04-30", areas: ["Municipal"] },
  { id: 46, section: "14", catName: "Otros ítems auditados", name: "Vínculos con otras entidades", status: "ok", tag: "Completado", detail: "Referencia completa disponible.", deadline: "", areas: ["Municipal"] },
  { id: 47, section: "14", catName: "Otros ítems auditados", name: "Índice de actos secretos o reservados", status: "ok", tag: "Completado", detail: "Publicado correctamente.", deadline: "", areas: ["Municipal"] },
  { id: 48, section: "14", catName: "Otros ítems auditados", name: "Sanciones conforme Título VI Ley de Transparencia", status: "ok", tag: "Completado", detail: "Ítem creado pero sin información para el año 2026.", deadline: "2026-04-30", areas: ["Municipal"] },
  { id: 49, section: "14", catName: "Otros ítems auditados", name: "Obligaciones Ley N°20.880", status: "ok", tag: "Completado", detail: "Publicada correctamente.", deadline: "", areas: ["Municipal"] }
];

async function update() {
  await connectMongo();
  console.log('Iniciando carga masiva con mapeo inteligente de carpetas...');

  const cats = await Category.find();
  const areas = await Area.find();
  const subs = await Subcategory.find();

  // Reset all items to Incompleto first
  await Item.updateMany({}, { status: 'Incompleto' });

  for (const d of data) {
    const cat = cats.find(c => c.code === d.section);
    if (!cat) continue;

    // INTELLIGENT MATCHING
    let sub = subs.find(s => 
      s.category.toString() === cat._id.toString() && 
      (s.name.toLowerCase().includes(d.name.toLowerCase()) || d.name.toLowerCase().includes(s.name.toLowerCase()))
    );

    // MANUAL OVERRIDES (Mapping items to their correct folders)
    if (!sub) {
      if (d.section === "01") {
        sub = subs.find(s => s.category.toString() === cat._id.toString()); // Only one folder in 01
      } else if (d.section === "02") {
        if (d.name.includes("Marco")) sub = subs.find(s => s.name.includes("Marco"));
        else sub = subs.find(s => s.name.includes("Potestades"));
      } else if (d.section === "04") {
        if (d.name.includes("planta")) sub = subs.find(s => s.name.includes("Planta"));
        else if (d.name.includes("contrata")) sub = subs.find(s => s.name.includes("Contrata"));
        else if (d.name.includes("honorarios")) sub = subs.find(s => s.name.includes("honorarios"));
        else if (d.name.includes("Código del Trabajo")) sub = subs.find(s => s.name.includes("Trabajo"));
        else if (d.name.includes("Escalas")) sub = subs.find(s => s.name.includes("Escala"));
        else if (d.name.includes("bonificaciones")) sub = subs.find(s => s.name.includes("bonificaciones"));
        else if (d.name.includes("Autoridades")) sub = subs.find(s => s.name.includes("Autoridades"));
      } else if (d.section === "05") {
        if (d.name.includes("Licitaciones")) sub = subs.find(s => s.name.includes("Licitaciones"));
        else if (d.name.includes("Compras menores")) sub = subs.find(s => s.name.includes("Compras Públicas"));
        else if (d.name.includes("Contratos formalizados")) sub = subs.find(s => s.name.includes("Compras Públicas"));
        else sub = subs.find(s => s.name.includes("Inmuebles"));
      } else if (d.section === "06") {
        if (d.name.includes("19.862")) sub = subs.find(s => s.name.includes("re"));
        else sub = subs.find(s => s.name.includes("Otras"));
      } else if (d.section === "07") {
        sub = subs.find(s => s.category.toString() === cat._id.toString());
      } else if (d.section === "10") {
        if (d.name.includes("Actas")) sub = subs.find(s => s.name.includes("Actas"));
        else if (d.name.includes("Mecanismos")) sub = subs.find(s => s.name.includes("Mecanismos"));
        else sub = subs.find(s => s.name.includes("Consejo Consultivo"));
      } else if (d.section === "11") {
        if (d.name.includes("Vehículos")) sub = subs.find(s => s.name.includes("Vehículos"));
        else if (d.name.includes("Balance")) sub = subs.find(s => s.name.includes("Balance"));
        else if (d.name.includes("financiera")) sub = subs.find(s => s.name.includes("financiera"));
        else sub = subs.find(s => s.name.includes("Ejecución Presupuestaria"));
      } else if (d.section === "13") {
        sub = subs.find(s => s.category.toString() === cat._id.toString());
      }
    }

    const itemAreas = d.areas.map(aname => {
      const a = areas.find(x => x.name === (aname === 'Múltiples' ? 'Municipal' : aname));
      return a ? a._id : null;
    }).filter(x => x);

    const statusMap = { ok: "Completo", warn: "Incompleto", bad: "Faltante" };
    const finalStatus = statusMap[d.status] || "Incompleto";

    const updateData = {
      name: d.name,
      category: cat._id,
      subcategory: sub ? sub._id : null,
      status: finalStatus,
      tag: d.tag,
      detail: d.detail,
      deadline: d.deadline,
      areas: itemAreas
    };

    let item = await Item.findOne({ name: d.name, category: cat._id });
    if (item) {
      Object.assign(item, updateData);
      await item.save();
    } else {
      item = new Item(updateData);
      await item.save();
    }
  }

  console.log('Carga masiva con carpetas finalizada.');
  process.exit(0);
}

update();
