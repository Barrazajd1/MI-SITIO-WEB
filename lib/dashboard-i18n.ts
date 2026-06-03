export type DashLocale = "en" | "es" | "fr" | "pt" | "it" | "de" | "id";

export type DashT = {
  appName: string;
  dashLabel: string;
  welcome: string;
  manageText: string;
  totalActive: string;
  proj: string;
  projs: string;
  allProjects: string;
  myProjects: string;
  newProject: string;
  noProjects: string;
  noProjectsHint: string;
  noProjectsStatus: string;
  seeAll: string;
  trash: string;
  trashTitle: string;
  trashDesc: string;
  trashEmpty: string;
  trashEmptyHint: string;
  back: string;
  restore: string;
  deleteForever: string;
  confirm: string;
  help: string;
  status: Record<string, string>;
  form: {
    name: string; nameReq: string; status: string;
    clientName: string; clientEmail: string; phone: string;
    budget: string; deadline: string; description: string;
    optional: string; create: string; saving: string;
  };
  card: {
    client: string; email: string; tel: string;
    budget: string; delivery: string; created: string;
    edit: string; moveDraft: string; moveTrash: string;
  };
  modal: { title: string; cancel: string; save: string; saving: string };
  about: string; aboutDesc: string; seeMore: string;
  services: string; servicesDesc: string; seeServices: string;
};

const t: Record<DashLocale, DashT> = {
  en: {
    appName: "My Site", dashLabel: "Dashboard",
    welcome: "Welcome", manageText: "Manage your projects from here.",
    totalActive: "Total active", proj: "project", projs: "projects",
    allProjects: "All projects", myProjects: "My projects", newProject: "New project",
    noProjects: "No projects yet", noProjectsHint: "Create your first project using the form.",
    noProjectsStatus: "No projects in this status.", seeAll: "See all →",
    trash: "Trash", trashTitle: "Trash",
    trashDesc: "project(s) — you can restore or permanently delete them.",
    trashEmpty: "Trash is empty", trashEmptyHint: "Projects you move to trash will appear here.",
    back: "Back to dashboard", restore: "Restore", deleteForever: "Delete", confirm: "Confirm?",
    help: "Help",
    status: { draft: "Draft", pending: "Pending", in_progress: "In progress", review: "In review", done: "Completed" },
    form: {
      name: "Project name", nameReq: "Project name *", status: "Status",
      clientName: "Client name", clientEmail: "Client email", phone: "Phone",
      budget: "Budget", deadline: "Deadline", description: "Description",
      optional: "(optional)", create: "Create project", saving: "Saving...",
    },
    card: {
      client: "Client", email: "Email", tel: "Phone",
      budget: "Budget", delivery: "Deadline", created: "Created",
      edit: "Edit", moveDraft: "Move to draft", moveTrash: "Move to trash",
    },
    modal: { title: "Edit project", cancel: "Cancel", save: "Save changes", saving: "Saving..." },
    about: "About us", aboutDesc: "We are a specialized team building fast, modern, multilingual websites with Next.js and JSON content.",
    seeMore: "See more →", services: "Our services",
    servicesDesc: "Web development, content management, localization, performance optimization, and ongoing support.",
    seeServices: "See services →",
  },
  es: {
    appName: "Mi Sitio", dashLabel: "Dashboard",
    welcome: "Bienvenido", manageText: "Gestiona tus proyectos desde aquí.",
    totalActive: "Total activos", proj: "proyecto", projs: "proyectos",
    allProjects: "Todos los proyectos", myProjects: "Mis proyectos", newProject: "Nuevo proyecto",
    noProjects: "No tienes proyectos aún", noProjectsHint: "Crea tu primer proyecto desde el formulario.",
    noProjectsStatus: "No hay proyectos en este estado.", seeAll: "Ver todos →",
    trash: "Papelera", trashTitle: "Papelera",
    trashDesc: "proyecto(s) — puedes restaurarlos o eliminarlos definitivamente.",
    trashEmpty: "La papelera está vacía", trashEmptyHint: "Los proyectos que muevas a la papelera aparecerán aquí.",
    back: "Volver al dashboard", restore: "Restaurar", deleteForever: "Eliminar", confirm: "¿Confirmar?",
    help: "Ayuda",
    status: { draft: "Borrador", pending: "Pendiente", in_progress: "En progreso", review: "En revisión", done: "Completado" },
    form: {
      name: "Nombre del proyecto", nameReq: "Nombre del proyecto *", status: "Estado",
      clientName: "Nombre del cliente", clientEmail: "Email del cliente", phone: "Teléfono",
      budget: "Presupuesto", deadline: "Fecha límite", description: "Descripción",
      optional: "(opcional)", create: "Crear proyecto", saving: "Guardando...",
    },
    card: {
      client: "Cliente", email: "Email", tel: "Tel",
      budget: "Presupuesto", delivery: "Entrega", created: "Creado",
      edit: "Editar", moveDraft: "Mover a borrador", moveTrash: "Mover a papelera",
    },
    modal: { title: "Editar proyecto", cancel: "Cancelar", save: "Guardar cambios", saving: "Guardando..." },
    about: "Quiénes somos", aboutDesc: "Somos un equipo especializado en crear sitios web rápidos, modernos y multilingües con Next.js y contenido JSON.",
    seeMore: "Ver más →", services: "Nuestros servicios",
    servicesDesc: "Desarrollo web, gestión de contenido, localización, optimización de rendimiento y soporte continuo.",
    seeServices: "Ver servicios →",
  },
  fr: {
    appName: "Mon Site", dashLabel: "Tableau de bord",
    welcome: "Bienvenue", manageText: "Gérez vos projets depuis ici.",
    totalActive: "Total actifs", proj: "projet", projs: "projets",
    allProjects: "Tous les projets", myProjects: "Mes projets", newProject: "Nouveau projet",
    noProjects: "Aucun projet pour l'instant", noProjectsHint: "Créez votre premier projet depuis le formulaire.",
    noProjectsStatus: "Aucun projet dans cet état.", seeAll: "Voir tout →",
    trash: "Corbeille", trashTitle: "Corbeille",
    trashDesc: "projet(s) — vous pouvez les restaurer ou les supprimer définitivement.",
    trashEmpty: "La corbeille est vide", trashEmptyHint: "Les projets que vous déplacez dans la corbeille apparaîtront ici.",
    back: "Retour au tableau de bord", restore: "Restaurer", deleteForever: "Supprimer", confirm: "Confirmer ?",
    help: "Aide",
    status: { draft: "Brouillon", pending: "En attente", in_progress: "En cours", review: "En révision", done: "Terminé" },
    form: {
      name: "Nom du projet", nameReq: "Nom du projet *", status: "Statut",
      clientName: "Nom du client", clientEmail: "Email du client", phone: "Téléphone",
      budget: "Budget", deadline: "Date limite", description: "Description",
      optional: "(optionnel)", create: "Créer le projet", saving: "Enregistrement...",
    },
    card: {
      client: "Client", email: "Email", tel: "Tél",
      budget: "Budget", delivery: "Livraison", created: "Créé",
      edit: "Modifier", moveDraft: "Mettre en brouillon", moveTrash: "Mettre à la corbeille",
    },
    modal: { title: "Modifier le projet", cancel: "Annuler", save: "Enregistrer", saving: "Enregistrement..." },
    about: "Qui sommes-nous", aboutDesc: "Nous sommes une équipe spécialisée dans la création de sites web rapides, modernes et multilingues avec Next.js et du contenu JSON.",
    seeMore: "En savoir plus →", services: "Nos services",
    servicesDesc: "Développement web, gestion de contenu, localisation, optimisation des performances et support continu.",
    seeServices: "Voir les services →",
  },
  pt: {
    appName: "Meu Site", dashLabel: "Painel",
    welcome: "Bem-vindo", manageText: "Gerencie seus projetos a partir daqui.",
    totalActive: "Total ativos", proj: "projeto", projs: "projetos",
    allProjects: "Todos os projetos", myProjects: "Meus projetos", newProject: "Novo projeto",
    noProjects: "Nenhum projeto ainda", noProjectsHint: "Crie seu primeiro projeto pelo formulário.",
    noProjectsStatus: "Nenhum projeto neste estado.", seeAll: "Ver todos →",
    trash: "Lixeira", trashTitle: "Lixeira",
    trashDesc: "projeto(s) — você pode restaurá-los ou excluí-los permanentemente.",
    trashEmpty: "A lixeira está vazia", trashEmptyHint: "Os projetos que você mover para a lixeira aparecerão aqui.",
    back: "Voltar ao painel", restore: "Restaurar", deleteForever: "Excluir", confirm: "Confirmar?",
    help: "Ajuda",
    status: { draft: "Rascunho", pending: "Pendente", in_progress: "Em andamento", review: "Em revisão", done: "Concluído" },
    form: {
      name: "Nome do projeto", nameReq: "Nome do projeto *", status: "Status",
      clientName: "Nome do cliente", clientEmail: "Email do cliente", phone: "Telefone",
      budget: "Orçamento", deadline: "Prazo", description: "Descrição",
      optional: "(opcional)", create: "Criar projeto", saving: "Salvando...",
    },
    card: {
      client: "Cliente", email: "Email", tel: "Tel",
      budget: "Orçamento", delivery: "Entrega", created: "Criado",
      edit: "Editar", moveDraft: "Mover para rascunho", moveTrash: "Mover para lixeira",
    },
    modal: { title: "Editar projeto", cancel: "Cancelar", save: "Salvar alterações", saving: "Salvando..." },
    about: "Quem somos", aboutDesc: "Somos uma equipe especializada em criar sites rápidos, modernos e multilíngues com Next.js e conteúdo JSON.",
    seeMore: "Ver mais →", services: "Nossos serviços",
    servicesDesc: "Desenvolvimento web, gestão de conteúdo, localização, otimização de desempenho e suporte contínuo.",
    seeServices: "Ver serviços →",
  },
  it: {
    appName: "Il Mio Sito", dashLabel: "Dashboard",
    welcome: "Benvenuto", manageText: "Gestisci i tuoi progetti da qui.",
    totalActive: "Totale attivi", proj: "progetto", projs: "progetti",
    allProjects: "Tutti i progetti", myProjects: "I miei progetti", newProject: "Nuovo progetto",
    noProjects: "Nessun progetto ancora", noProjectsHint: "Crea il tuo primo progetto dal modulo.",
    noProjectsStatus: "Nessun progetto in questo stato.", seeAll: "Vedi tutti →",
    trash: "Cestino", trashTitle: "Cestino",
    trashDesc: "progetto/i — puoi ripristinarli o eliminarli definitivamente.",
    trashEmpty: "Il cestino è vuoto", trashEmptyHint: "I progetti che sposti nel cestino appariranno qui.",
    back: "Torna alla dashboard", restore: "Ripristina", deleteForever: "Elimina", confirm: "Confermare?",
    help: "Aiuto",
    status: { draft: "Bozza", pending: "In attesa", in_progress: "In corso", review: "In revisione", done: "Completato" },
    form: {
      name: "Nome del progetto", nameReq: "Nome del progetto *", status: "Stato",
      clientName: "Nome del cliente", clientEmail: "Email del cliente", phone: "Telefono",
      budget: "Budget", deadline: "Scadenza", description: "Descrizione",
      optional: "(opzionale)", create: "Crea progetto", saving: "Salvataggio...",
    },
    card: {
      client: "Cliente", email: "Email", tel: "Tel",
      budget: "Budget", delivery: "Consegna", created: "Creato",
      edit: "Modifica", moveDraft: "Sposta in bozza", moveTrash: "Sposta nel cestino",
    },
    modal: { title: "Modifica progetto", cancel: "Annulla", save: "Salva modifiche", saving: "Salvataggio..." },
    about: "Chi siamo", aboutDesc: "Siamo un team specializzato nella creazione di siti web veloci, moderni e multilingue con Next.js e contenuti JSON.",
    seeMore: "Scopri di più →", services: "I nostri servizi",
    servicesDesc: "Sviluppo web, gestione dei contenuti, localizzazione, ottimizzazione delle prestazioni e supporto continuo.",
    seeServices: "Vedi servizi →",
  },
  de: {
    appName: "Meine Website", dashLabel: "Dashboard",
    welcome: "Willkommen", manageText: "Verwalten Sie Ihre Projekte von hier aus.",
    totalActive: "Gesamt aktiv", proj: "Projekt", projs: "Projekte",
    allProjects: "Alle Projekte", myProjects: "Meine Projekte", newProject: "Neues Projekt",
    noProjects: "Noch keine Projekte", noProjectsHint: "Erstellen Sie Ihr erstes Projekt über das Formular.",
    noProjectsStatus: "Keine Projekte in diesem Status.", seeAll: "Alle anzeigen →",
    trash: "Papierkorb", trashTitle: "Papierkorb",
    trashDesc: "Projekt(e) — Sie können diese wiederherstellen oder dauerhaft löschen.",
    trashEmpty: "Der Papierkorb ist leer", trashEmptyHint: "Projekte, die Sie in den Papierkorb verschieben, erscheinen hier.",
    back: "Zurück zum Dashboard", restore: "Wiederherstellen", deleteForever: "Löschen", confirm: "Bestätigen?",
    help: "Hilfe",
    status: { draft: "Entwurf", pending: "Ausstehend", in_progress: "In Bearbeitung", review: "In Prüfung", done: "Abgeschlossen" },
    form: {
      name: "Projektname", nameReq: "Projektname *", status: "Status",
      clientName: "Kundenname", clientEmail: "Kunden-E-Mail", phone: "Telefon",
      budget: "Budget", deadline: "Frist", description: "Beschreibung",
      optional: "(optional)", create: "Projekt erstellen", saving: "Wird gespeichert...",
    },
    card: {
      client: "Kunde", email: "E-Mail", tel: "Tel",
      budget: "Budget", delivery: "Lieferung", created: "Erstellt",
      edit: "Bearbeiten", moveDraft: "Als Entwurf markieren", moveTrash: "In Papierkorb",
    },
    modal: { title: "Projekt bearbeiten", cancel: "Abbrechen", save: "Änderungen speichern", saving: "Wird gespeichert..." },
    about: "Über uns", aboutDesc: "Wir sind ein spezialisiertes Team, das schnelle, moderne und mehrsprachige Websites mit Next.js und JSON-Inhalten entwickelt.",
    seeMore: "Mehr erfahren →", services: "Unsere Leistungen",
    servicesDesc: "Webentwicklung, Content-Management, Lokalisierung, Performance-Optimierung und kontinuierlicher Support.",
    seeServices: "Leistungen ansehen →",
  },
  id: {
    appName: "Situs Saya", dashLabel: "Dasbor",
    welcome: "Selamat datang", manageText: "Kelola proyek Anda dari sini.",
    totalActive: "Total aktif", proj: "proyek", projs: "proyek",
    allProjects: "Semua proyek", myProjects: "Proyek saya", newProject: "Proyek baru",
    noProjects: "Belum ada proyek", noProjectsHint: "Buat proyek pertama Anda dari formulir.",
    noProjectsStatus: "Tidak ada proyek dalam status ini.", seeAll: "Lihat semua →",
    trash: "Sampah", trashTitle: "Tempat Sampah",
    trashDesc: "proyek — Anda dapat memulihkan atau menghapus secara permanen.",
    trashEmpty: "Tempat sampah kosong", trashEmptyHint: "Proyek yang Anda pindahkan ke tempat sampah akan muncul di sini.",
    back: "Kembali ke dasbor", restore: "Pulihkan", deleteForever: "Hapus", confirm: "Konfirmasi?",
    help: "Bantuan",
    status: { draft: "Draf", pending: "Tertunda", in_progress: "Sedang berjalan", review: "Dalam tinjauan", done: "Selesai" },
    form: {
      name: "Nama proyek", nameReq: "Nama proyek *", status: "Status",
      clientName: "Nama klien", clientEmail: "Email klien", phone: "Telepon",
      budget: "Anggaran", deadline: "Batas waktu", description: "Deskripsi",
      optional: "(opsional)", create: "Buat proyek", saving: "Menyimpan...",
    },
    card: {
      client: "Klien", email: "Email", tel: "Tel",
      budget: "Anggaran", delivery: "Pengiriman", created: "Dibuat",
      edit: "Edit", moveDraft: "Pindah ke draf", moveTrash: "Pindah ke sampah",
    },
    modal: { title: "Edit proyek", cancel: "Batal", save: "Simpan perubahan", saving: "Menyimpan..." },
    about: "Tentang kami", aboutDesc: "Kami adalah tim khusus yang membangun website cepat, modern, dan multibahasa dengan Next.js dan konten JSON.",
    seeMore: "Lihat selengkapnya →", services: "Layanan kami",
    servicesDesc: "Pengembangan web, manajemen konten, lokalisasi, optimasi performa, dan dukungan berkelanjutan.",
    seeServices: "Lihat layanan →",
  },
};

export function getDashT(locale: string): DashT {
  return t[(locale as DashLocale)] ?? t.en;
}
