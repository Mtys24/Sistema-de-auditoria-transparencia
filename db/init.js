const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'auditoria.db');

function initDB(customPath) {
  const db = new Database(customPath || DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      section TEXT NOT NULL,
      section_name TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('ok','warn','bad')),
      tag TEXT NOT NULL,
      detail TEXT,
      prev_observation TEXT,
      deadline TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS areas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS item_areas (
      item_id INTEGER NOT NULL,
      area_id INTEGER NOT NULL,
      PRIMARY KEY (item_id, area_id),
      FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
      FOREIGN KEY (area_id) REFERENCES areas(id) ON DELETE CASCADE
    );
  `);

  return db;
}

function seed(db) {
  const count = db.prepare('SELECT COUNT(*) as c FROM items').get();
  if (count.c > 0) {
    console.log('Database already seeded. Skipping.');
    return;
  }

  // Deadline: 30 de abril de 2026
  const DL = '2026-04-30';

  const ITEMS = [
    // ═══════════════════════════════════════════════════════
    // SECCIÓN 01 — Actos y documentos publicados en Diario Oficial
    // ═══════════════════════════════════════════════════════
    {
      name: "Actos y documentos del organismo publicados en el Diario Oficial",
      section: "01", section_name: "Actos y documentos publicados en Diario Oficial",
      status: "bad", tag: "Falta ene/feb/mar",
      detail: "Falta publicación de enero, febrero y marzo 2026.",
      prev: null, areas: ["Municipal"], deadline: DL
    },

    // ═══════════════════════════════════════════════════════
    // SECCIÓN 02 — Potestades, competencias, responsabilidades, funciones, atribuciones
    // ═══════════════════════════════════════════════════════
    {
      name: "Potestades y atribuciones del organismo",
      section: "02", section_name: "Potestades, competencias y atribuciones",
      status: "ok", tag: "Completado",
      detail: "Información disponible y al día.",
      prev: null, areas: ["Municipal"], deadline: null
    },
    {
      name: "Marco normativo",
      section: "02", section_name: "Potestades, competencias y atribuciones",
      status: "ok", tag: "Completado",
      detail: "Publicado correctamente.",
      prev: null, areas: ["Municipal"], deadline: null
    },
    {
      name: "Facultades de unidades internas",
      section: "02", section_name: "Potestades, competencias y atribuciones",
      status: "ok", tag: "Completado",
      detail: "Información completa.",
      prev: null, areas: ["Municipal"], deadline: null
    },

    // ═══════════════════════════════════════════════════════
    // SECCIÓN 03 — Estructura orgánica y facultades, funciones y atribuciones
    // ═══════════════════════════════════════════════════════
    {
      name: "Organigrama",
      section: "03", section_name: "Estructura orgánica y facultades",
      status: "ok", tag: "Completado",
      detail: "Publicado correctamente.",
      prev: null, areas: ["Municipal"], deadline: null
    },
    {
      name: "Estructura orgánica de Transparencia y Protección de Datos",
      section: "03", section_name: "Estructura orgánica y facultades",
      status: "bad", tag: "No creado",
      detail: "No está publicado en la página de Transparencia Activa. Requerido por el Consejo para la Transparencia.",
      prev: "Auditoría anterior detectó infracción al art. 5° de la Resolución Exenta N°500. Información no disponible.",
      areas: ["Municipal"], deadline: DL
    },

    // ═══════════════════════════════════════════════════════
    // SECCIÓN 04 — Personal y remuneraciones
    // ═══════════════════════════════════════════════════════
    {
      name: "Personal de planta",
      section: "04", section_name: "Personal y remuneraciones",
      status: "warn", tag: "Parcial",
      detail: "Municipal y Salud faltan datos de marzo. Educación sí cuenta con marzo.",
      prev: null, areas: ["Municipal", "Salud", "Educación"], deadline: DL
    },
    {
      name: "Personal a contrata",
      section: "04", section_name: "Personal y remuneraciones",
      status: "warn", tag: "Parcial",
      detail: "Municipal y Salud faltan datos de marzo. Educación sí cuenta con marzo.",
      prev: null, areas: ["Municipal", "Salud", "Educación"], deadline: DL
    },
    {
      name: "Personal sujeto al Código del Trabajo (Educación — Jardines VTF)",
      section: "04", section_name: "Personal y remuneraciones",
      status: "bad", tag: "Falta feb/mar",
      detail: "En Educación: Jardines VTF falta febrero y marzo 2026. Municipal y Salud también faltan datos de marzo.",
      prev: null, areas: ["Municipal", "Salud", "Educación"], deadline: DL
    },
    {
      name: "Personas naturales contratadas a honorarios",
      section: "04", section_name: "Personal y remuneraciones",
      status: "bad", tag: "No actualizado",
      detail: "Municipal y Educación no están actualizados a marzo 2026. Educación no tiene publicado el año 2026.",
      prev: "Auditoría anterior: información desactualizada en educación. Incumplimiento art. 5° y 102° de la Resolución N°500.",
      areas: ["Municipal", "Educación"], deadline: DL
    },
    {
      name: "Escalas de remuneraciones",
      section: "04", section_name: "Personal y remuneraciones",
      status: "ok", tag: "Completado",
      detail: "Información disponible y al día.",
      prev: null, areas: ["Municipal"], deadline: null
    },
    {
      name: "Información estadística sobre bonificaciones",
      section: "04", section_name: "Personal y remuneraciones",
      status: "bad", tag: "No actualizado",
      detail: "Municipal y Educación no están actualizados a marzo 2026.",
      prev: null, areas: ["Municipal", "Educación"], deadline: DL
    },
    {
      name: "Autoridades de elección popular o designación",
      section: "04", section_name: "Personal y remuneraciones",
      status: "ok", tag: "Completado",
      detail: "Publicado correctamente.",
      prev: null, areas: ["Municipal"], deadline: null
    },

    // ═══════════════════════════════════════════════════════
    // SECCIÓN 05 — Adquisiciones y contrataciones
    // ═══════════════════════════════════════════════════════
    {
      name: "Licitaciones Públicas y Privadas",
      section: "05", section_name: "Adquisiciones y contrataciones",
      status: "bad", tag: "No actualizado",
      detail: "Municipal y Educación no están actualizados a marzo 2026.",
      prev: null, areas: ["Municipal", "Educación"], deadline: DL
    },
    {
      name: "Compras menores a 3 UTM",
      section: "05", section_name: "Adquisiciones y contrataciones",
      status: "bad", tag: "No actualizado",
      detail: "Municipal, Educación y Salud no están actualizados a marzo 2026.",
      prev: "Auditoría anterior: el enlace no dirigía a información correcta. Incumplimiento art. 5° de la Resolución N°500.",
      areas: ["Municipal", "Educación", "Salud"], deadline: DL
    },
    {
      name: "Contratos formalizados mediante la emisión de orden de compra",
      section: "05", section_name: "Adquisiciones y contrataciones",
      status: "bad", tag: "No actualizado",
      detail: "Municipal, Educación y Salud no están actualizados a marzo 2026.",
      prev: "Auditoría anterior: ausencia de información de educación y falta de mensaje de período sin datos. Incumplimiento art. 5° y 102° de la Resolución N°500.",
      areas: ["Municipal", "Educación", "Salud"], deadline: DL
    },
    {
      name: "Contrataciones fuera de Compras Públicas — bienes y servicios",
      section: "05", section_name: "Adquisiciones y contrataciones",
      status: "ok", tag: "Completado",
      detail: "Corregido tras auditoría anterior donde no estaba publicado.",
      prev: null, areas: ["Municipal"], deadline: null
    },
    {
      name: "Contrataciones relativas a bienes inmuebles",
      section: "05", section_name: "Adquisiciones y contrataciones",
      status: "warn", tag: "Revisar",
      detail: "Aparece completa, pero verificar vigencia de la información.",
      prev: "Auditoría anterior: datos desactualizados al mes de enero de 2025. Incumplimiento art. 5° y 102° de la Resolución N°500.",
      areas: ["Municipal"], deadline: DL
    },

    // ═══════════════════════════════════════════════════════
    // SECCIÓN 06 — Transferencias
    // ═══════════════════════════════════════════════════════
    {
      name: "Transferencias Ley N°19.862",
      section: "06", section_name: "Transferencias",
      status: "warn", tag: "Revisar link",
      detail: "Enlace con comportamiento raro al momento de revisión.",
      prev: "Auditoría anterior reportó error 404 al ingresar.",
      areas: ["Municipal"], deadline: DL
    },
    {
      name: "Otras transferencias",
      section: "06", section_name: "Transferencias",
      status: "bad", tag: "Sin datos 2026",
      detail: "No hay información del año 2026.",
      prev: "Auditoría anterior: datos desactualizados a febrero de 2025. Incumplimiento art. 5° y 102° de la Resolución N°500.",
      areas: ["Municipal"], deadline: DL
    },

    // ═══════════════════════════════════════════════════════
    // SECCIÓN 07 — Actos y resoluciones con efectos sobre terceras personas
    // ═══════════════════════════════════════════════════════
    {
      name: "Órdenes de Pago",
      section: "07", section_name: "Actos y resoluciones con efectos sobre terceros",
      status: "bad", tag: "No actualizado",
      detail: "No está actualizado a marzo 2026.",
      prev: null, areas: ["Municipal"], deadline: DL
    },
    {
      name: "Decretos de Pago",
      section: "07", section_name: "Actos y resoluciones con efectos sobre terceros",
      status: "bad", tag: "No actualizado",
      detail: "Educación y Municipal no están actualizados a marzo 2026.",
      prev: null, areas: ["Educación", "Municipal"], deadline: DL
    },
    {
      name: "Horario de carga y descarga",
      section: "07", section_name: "Actos y resoluciones con efectos sobre terceros",
      status: "bad", tag: "No actualizado",
      detail: "No está actualizado a marzo 2026.",
      prev: null, areas: ["Municipal"], deadline: DL
    },
    // ═══════════════════════════════════════════════════════
    // SECCIÓN 08 — Trámites y requisitos
    // ═══════════════════════════════════════════════════════
    {
      name: "Trámites y requisitos para acceso a servicios",
      section: "08", section_name: "Trámites y requisitos",
      status: "warn", tag: "Sin confirmar",
      detail: "Duda sobre si el ítem está efectivamente creado.",
      prev: null, areas: ["Municipal"], deadline: DL
    },

    // ═══════════════════════════════════════════════════════
    // SECCIÓN 09 — Subsidios y beneficios
    // ═══════════════════════════════════════════════════════
    {
      name: "Subsidios y beneficios propios",
      section: "09", section_name: "Subsidios y beneficios",
      status: "bad", tag: "No actualizado",
      detail: "No está actualizado a marzo 2026.",
      prev: null, areas: ["Municipal"], deadline: DL
    },
    {
      name: "Subsidios y beneficios como intermediario",
      section: "09", section_name: "Subsidios y beneficios",
      status: "bad", tag: "No actualizado",
      detail: "No está actualizado a marzo 2026.",
      prev: null, areas: ["Municipal"], deadline: DL
    },
    {
      name: "Nómina de beneficiarios",
      section: "09", section_name: "Subsidios y beneficios",
      status: "bad", tag: "No actualizado",
      detail: "No está actualizado a marzo 2026. Faltan sub-ítems de 2026 en todas las sub-carpetas.",
      prev: null, areas: ["Municipal"], deadline: DL
    },

    // ═══════════════════════════════════════════════════════
    // SECCIÓN 10 — Mecanismos de participación ciudadana
    // ═══════════════════════════════════════════════════════
    {
      name: "Actas de los mecanismos de participación ciudadana",
      section: "10", section_name: "Mecanismos de participación ciudadana",
      status: "bad", tag: "No actualizado",
      detail: "No está actualizado a marzo 2026. Actas Consejo de Seguridad Pública falta 2026. Actas Oficina Local de la Niñez falta 2025 y 2026.",
      prev: null, areas: ["Municipal"], deadline: DL
    },
    {
      name: "Consejos consultivos",
      section: "10", section_name: "Mecanismos de participación ciudadana",
      status: "bad", tag: "No actualizado",
      detail: "No está actualizado a marzo 2026.",
      prev: "Auditoría anterior: información desactualizada al año 2024. Incumplimiento art. 5° y 102° de la Resolución N°500.",
      areas: ["Municipal"], deadline: DL
    },
    {
      name: "Consejo Consultivo",
      section: "10", section_name: "Mecanismos de participación ciudadana",
      status: "bad", tag: "No creado",
      detail: "Ítem no creado en Transparencia Activa. No está actualizado a marzo 2026.",
      prev: null, areas: ["Municipal"], deadline: DL
    },
    {
      name: "Mecanismos de participación ciudadana en ejecución",
      section: "10", section_name: "Mecanismos de participación ciudadana",
      status: "bad", tag: "No actualizado",
      detail: "No está actualizado a marzo 2026. Falta información del año 2026.",
      prev: null, areas: ["Municipal"], deadline: DL
    },
    {
      name: "Norma de participación ciudadana",
      section: "10", section_name: "Mecanismos de participación ciudadana",
      status: "ok", tag: "Completado",
      detail: "Publicada correctamente.",
      prev: null, areas: ["Municipal"], deadline: null
    },

    // ═══════════════════════════════════════════════════════
    // SECCIÓN 11 — Información Presupuestaria
    // ═══════════════════════════════════════════════════════
    {
      name: "Vehículos del organismo",
      section: "11", section_name: "Información presupuestaria",
      status: "bad", tag: "No actualizado",
      detail: "Educación y Municipal no están actualizados a marzo 2026. Solo Salud tiene datos.",
      prev: null, areas: ["Educación", "Municipal"], deadline: DL
    },
    {
      name: "Balance de ejecución presupuestaria",
      section: "11", section_name: "Información presupuestaria",
      status: "bad", tag: "No actualizado",
      detail: "Educación no está actualizado a marzo 2026.",
      prev: null, areas: ["Educación"], deadline: DL
    },
    {
      name: "Estado de situación financiera",
      section: "11", section_name: "Información presupuestaria",
      status: "bad", tag: "No actualizado",
      detail: "Educación no está actualizado a marzo 2026.",
      prev: null, areas: ["Educación"], deadline: DL
    },
    {
      name: "Pasivos del municipio y de las corporaciones municipales",
      section: "11", section_name: "Información presupuestaria",
      status: "bad", tag: "No actualizado",
      detail: "Educación no está actualizado a marzo 2026.",
      prev: null, areas: ["Educación"], deadline: DL
    },
    {
      name: "Ejecución presupuestaria",
      section: "11", section_name: "Información presupuestaria",
      status: "bad", tag: "No actualizado",
      detail: "Educación no está actualizado a marzo 2026.",
      prev: null, areas: ["Educación"], deadline: DL
    },
    {
      name: "Balance de comprobación y de saldos agregado",
      section: "11", section_name: "Información presupuestaria",
      status: "bad", tag: "No actualizado",
      detail: "Educación no está actualizado a marzo 2026.",
      prev: null, areas: ["Educación"], deadline: DL
    },
    {
      name: "Informe analítico de variaciones de la ejecución presupuestaria",
      section: "11", section_name: "Información presupuestaria",
      status: "bad", tag: "No actualizado",
      detail: "Educación no está actualizado a marzo 2026.",
      prev: null, areas: ["Educación"], deadline: DL
    },
    {
      name: "Informe analítico de variaciones de la deuda",
      section: "11", section_name: "Información presupuestaria",
      status: "bad", tag: "No actualizado",
      detail: "Educación no está actualizado a marzo 2026.",
      prev: null, areas: ["Educación"], deadline: DL
    },
    {
      name: "Informe analítico de variaciones de la ejecución presupuestaria de iniciativas de inversión",
      section: "11", section_name: "Información presupuestaria",
      status: "bad", tag: "No actualizado",
      detail: "Educación no está actualizado a marzo 2026.",
      prev: null, areas: ["Educación"], deadline: DL
    },
    {
      name: "Libro diario municipal",
      section: "11", section_name: "Información presupuestaria",
      status: "bad", tag: "No actualizado",
      detail: "Educación no está actualizado a marzo 2026.",
      prev: null, areas: ["Educación"], deadline: DL
    },

    // ═══════════════════════════════════════════════════════
    // SECCIÓN 12 — Auditorías al ejercicio presupuestario
    // ═══════════════════════════════════════════════════════
    {
      name: "Auditorías internas (Dirección de Control Interna)",
      section: "12", section_name: "Auditorías al ejercicio presupuestario",
      status: "bad", tag: "No actualizado",
      detail: "No está actualizado a marzo 2026. Auditorías de Contraloría: completas.",
      prev: null, areas: ["Municipal"], deadline: DL
    },

    // ═══════════════════════════════════════════════════════
    // SECCIÓN 13 — Extra / Varios
    // ═══════════════════════════════════════════════════════
    {
      name: "Publicidad de las obligaciones contenidas en la Ley N°20.730",
      section: "13", section_name: "Extra",
      status: "bad", tag: "No encontrado",
      detail: "No está actualizado a marzo 2026. No se encuentra en la página de Transparencia Activa.",
      prev: null, areas: ["Municipal"], deadline: DL
    },
    {
      name: "Informe Anual Subdere",
      section: "13", section_name: "Extra",
      status: "bad", tag: "No encontrado",
      detail: "No está actualizado a marzo 2026. No se encuentra creado en la página de Transparencia Activa.",
      prev: null, areas: ["Municipal"], deadline: DL
    },

    // ═══════════════════════════════════════════════════════
    // SECCIÓN 14 — Otros ítems de la auditoría (completados)
    // ═══════════════════════════════════════════════════════
    {
      name: "Vínculos con otras entidades",
      section: "14", section_name: "Otros ítems auditados",
      status: "ok", tag: "Completado",
      detail: "Referencia completa disponible.",
      prev: null, areas: ["Municipal"], deadline: null
    },
    {
      name: "Índice de actos secretos o reservados",
      section: "14", section_name: "Otros ítems auditados",
      status: "ok", tag: "Completado",
      detail: "Publicado correctamente.",
      prev: null, areas: ["Municipal"], deadline: null
    },
    {
      name: "Sanciones conforme Título VI Ley de Transparencia",
      section: "14", section_name: "Otros ítems auditados",
      status: "warn", tag: "Sin datos 2026",
      detail: "Ítem creado pero sin información para el año 2026.",
      prev: null, areas: ["Municipal"], deadline: DL
    },
    {
      name: "Obligaciones Ley N°20.880",
      section: "14", section_name: "Otros ítems auditados",
      status: "ok", tag: "Completado",
      detail: "Publicada correctamente.",
      prev: null, areas: ["Municipal"], deadline: null
    }
  ];

  // Insert areas first
  const allAreas = [...new Set(ITEMS.flatMap(i => i.areas))];
  const insertArea = db.prepare('INSERT OR IGNORE INTO areas (name) VALUES (?)');
  const getArea = db.prepare('SELECT id FROM areas WHERE name = ?');
  const insertItem = db.prepare('INSERT INTO items (name, section, section_name, status, tag, detail, prev_observation, deadline) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  const insertItemArea = db.prepare('INSERT INTO item_areas (item_id, area_id) VALUES (?, ?)');

  const seedAll = db.transaction(() => {
    for (const areaName of allAreas) {
      insertArea.run(areaName);
    }

    for (const item of ITEMS) {
      const result = insertItem.run(
        item.name, item.section, item.section_name,
        item.status, item.tag, item.detail,
        item.prev || null, item.deadline || null
      );
      const itemId = result.lastInsertRowid;

      for (const areaName of item.areas) {
        const area = getArea.get(areaName);
        insertItemArea.run(itemId, area.id);
      }
    }
  });

  seedAll();
  console.log(`Seeded ${ITEMS.length} items and ${allAreas.length} areas.`);
}

module.exports = { initDB, seed, DB_PATH };

// Run directly
if (require.main === module) {
  const db = initDB();
  seed(db);
  db.close();
  console.log('Database initialized at:', DB_PATH);
}
