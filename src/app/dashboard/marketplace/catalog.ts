export interface CatalogItem {
  slug: string;
  name: string;
  description: string;
  category: string;
  icon: string | null;
  author: string | null;
  serverType: "local" | "remote";
  tags: string[];
  featured: boolean;
  verified: boolean;
  configParams: Array<{
    key: string;
    label: string;
    placeholder: string;
    required: boolean;
    secret: boolean;
  }>;
  configTemplate: Record<string, unknown>;
}

export const CATALOG: CatalogItem[] = [
  {
    slug: "github",
    name: "GitHub",
    description:
      "Access GitHub repositories, issues, pull requests, and code search.",
    category: "developer",
    icon: "Github",
    author: "Anthropic",
    serverType: "local",
    tags: ["version-control", "code-review", "issues"],
    featured: true,
    verified: true,
    configTemplate: {
      type: "local",
      command: ["npx", "-y", "@modelcontextprotocol/server-github"],
      environment: { GITHUB_PERSONAL_ACCESS_TOKEN: "" },
    },
    configParams: [
      {
        key: "GITHUB_PERSONAL_ACCESS_TOKEN",
        label: "GitHub Personal Access Token",
        placeholder: "ghp_xxxxxxxxxxxxxxxxxxxx",
        required: true,
        secret: true,
      },
    ],
  },
  {
    slug: "slack",
    name: "Slack",
    description:
      "Read and send messages in Slack channels. Search conversations and interact with your team.",
    category: "communication",
    icon: "MessageSquare",
    author: "Anthropic",
    serverType: "local",
    tags: ["messaging", "team-communication"],
    featured: true,
    verified: true,
    configTemplate: {
      type: "local",
      command: ["npx", "-y", "@modelcontextprotocol/server-slack"],
      environment: { SLACK_BOT_TOKEN: "", SLACK_TEAM_ID: "" },
    },
    configParams: [
      {
        key: "SLACK_BOT_TOKEN",
        label: "Slack Bot Token",
        placeholder: "xoxb-...",
        required: true,
        secret: true,
      },
      {
        key: "SLACK_TEAM_ID",
        label: "Slack Team ID",
        placeholder: "T0123456789",
        required: true,
        secret: false,
      },
    ],
  },
  {
    slug: "notion",
    name: "Notion",
    description:
      "Search, read, and create pages in Notion. Manage databases and workspace content.",
    category: "productivity",
    icon: "FileText",
    author: "Anthropic",
    serverType: "local",
    tags: ["notes", "wiki", "project-management"],
    featured: true,
    verified: true,
    configTemplate: {
      type: "local",
      command: ["npx", "-y", "@notionhq/notion-mcp-server"],
      environment: { OPENAPI_MCP_HEADERS: "" },
    },
    configParams: [
      {
        key: "NOTION_API_KEY",
        label: "Notion Integration Token",
        placeholder: "ntn_...",
        required: true,
        secret: true,
      },
    ],
  },
  {
    slug: "supabase",
    name: "Supabase",
    description:
      "Manage Supabase projects, run SQL queries, manage tables, and deploy edge functions.",
    category: "database",
    icon: "Database",
    author: "Supabase",
    serverType: "remote",
    tags: ["database", "postgres", "serverless"],
    featured: true,
    verified: true,
    configTemplate: {
      type: "remote",
      url: "https://mcp.supabase.com",
    },
    configParams: [],
  },
  {
    slug: "linear",
    name: "Linear",
    description:
      "Create and manage Linear issues, projects, and cycles. Track engineering work.",
    category: "productivity",
    icon: "CheckSquare",
    author: "Community",
    serverType: "local",
    tags: ["project-management", "issue-tracking"],
    featured: false,
    verified: true,
    configTemplate: {
      type: "local",
      command: ["npx", "-y", "mcp-linear"],
      environment: { LINEAR_API_KEY: "" },
    },
    configParams: [
      {
        key: "LINEAR_API_KEY",
        label: "Linear API Key",
        placeholder: "lin_api_...",
        required: true,
        secret: true,
      },
    ],
  },
  {
    slug: "postgres",
    name: "PostgreSQL",
    description:
      "Connect to PostgreSQL databases. Run queries, inspect schemas, and manage tables.",
    category: "database",
    icon: "Database",
    author: "Anthropic",
    serverType: "local",
    tags: ["database", "sql"],
    featured: false,
    verified: true,
    configTemplate: {
      type: "local",
      command: ["npx", "-y", "@modelcontextprotocol/server-postgres"],
      environment: { POSTGRES_URL: "" },
    },
    configParams: [
      {
        key: "POSTGRES_URL",
        label: "PostgreSQL Connection URL",
        placeholder: "postgresql://user:pass@host:5432/db",
        required: true,
        secret: true,
      },
    ],
  },
  {
    slug: "filesystem",
    name: "Filesystem",
    description: "Read, write, and manage files on the local filesystem.",
    category: "developer",
    icon: "FolderOpen",
    author: "Anthropic",
    serverType: "local",
    tags: ["files", "local"],
    featured: false,
    verified: true,
    configTemplate: {
      type: "local",
      command: [
        "npx",
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/path/to/dir",
      ],
    },
    configParams: [
      {
        key: "ALLOWED_DIR",
        label: "Allowed Directory Path",
        placeholder: "/Users/you/projects",
        required: true,
        secret: false,
      },
    ],
  },
  {
    slug: "brave-search",
    name: "Brave Search",
    description:
      "Search the web using Brave Search API. Get search results and web pages.",
    category: "ai",
    icon: "Search",
    author: "Anthropic",
    serverType: "local",
    tags: ["search", "web"],
    featured: false,
    verified: true,
    configTemplate: {
      type: "local",
      command: ["npx", "-y", "@modelcontextprotocol/server-brave-search"],
      environment: { BRAVE_API_KEY: "" },
    },
    configParams: [
      {
        key: "BRAVE_API_KEY",
        label: "Brave Search API Key",
        placeholder: "BSA...",
        required: true,
        secret: true,
      },
    ],
  },
  {
    slug: "google-drive",
    name: "Google Drive",
    description:
      "Search and read files from Google Drive. Access documents and spreadsheets.",
    category: "productivity",
    icon: "HardDrive",
    author: "Anthropic",
    serverType: "local",
    tags: ["files", "cloud-storage"],
    featured: false,
    verified: true,
    configTemplate: {
      type: "local",
      command: ["npx", "-y", "@modelcontextprotocol/server-gdrive"],
      environment: { GDRIVE_CLIENT_ID: "", GDRIVE_CLIENT_SECRET: "" },
    },
    configParams: [
      {
        key: "GDRIVE_CLIENT_ID",
        label: "Google OAuth Client ID",
        placeholder: "xxxx.apps.googleusercontent.com",
        required: true,
        secret: false,
      },
      {
        key: "GDRIVE_CLIENT_SECRET",
        label: "Google OAuth Client Secret",
        placeholder: "GOCSPX-...",
        required: true,
        secret: true,
      },
    ],
  },
  {
    slug: "sentry",
    name: "Sentry",
    description:
      "Access Sentry error tracking data. View issues, events, and project details.",
    category: "developer",
    icon: "Bug",
    author: "Sentry",
    serverType: "local",
    tags: ["error-tracking", "monitoring"],
    featured: false,
    verified: true,
    configTemplate: {
      type: "local",
      command: ["npx", "-y", "@sentry/mcp-server"],
      environment: { SENTRY_AUTH_TOKEN: "" },
    },
    configParams: [
      {
        key: "SENTRY_AUTH_TOKEN",
        label: "Sentry Auth Token",
        placeholder: "sntrys_...",
        required: true,
        secret: true,
      },
    ],
  },
  {
    slug: "puppeteer",
    name: "Puppeteer",
    description:
      "Control a headless browser for web scraping, testing, and automation.",
    category: "developer",
    icon: "Globe",
    author: "Anthropic",
    serverType: "local",
    tags: ["browser", "scraping", "automation"],
    featured: false,
    verified: true,
    configTemplate: {
      type: "local",
      command: ["npx", "-y", "@modelcontextprotocol/server-puppeteer"],
    },
    configParams: [],
  },
  {
    slug: "sqlite",
    name: "SQLite",
    description:
      "Query and manage SQLite databases. Execute SQL and inspect schemas.",
    category: "database",
    icon: "Database",
    author: "Anthropic",
    serverType: "local",
    tags: ["database", "sql", "local"],
    featured: false,
    verified: true,
    configTemplate: {
      type: "local",
      command: ["npx", "-y", "@modelcontextprotocol/server-sqlite"],
      environment: { SQLITE_DB_PATH: "" },
    },
    configParams: [
      {
        key: "SQLITE_DB_PATH",
        label: "SQLite Database Path",
        placeholder: "/path/to/database.db",
        required: true,
        secret: false,
      },
    ],
  },
  {
    slug: "memory",
    name: "Memory (Knowledge Graph)",
    description:
      "Persistent memory using a local knowledge graph. Store facts and relationships across sessions.",
    category: "ai",
    icon: "Brain",
    author: "Anthropic",
    serverType: "local",
    tags: ["memory", "knowledge-graph", "persistence"],
    featured: true,
    verified: true,
    configTemplate: {
      type: "local",
      command: ["npx", "-y", "@modelcontextprotocol/server-memory"],
    },
    configParams: [],
  },
  {
    slug: "exa",
    name: "Exa Search",
    description:
      "AI-powered web search using Exa. Find relevant content and documentation.",
    category: "ai",
    icon: "Sparkles",
    author: "Exa",
    serverType: "local",
    tags: ["search", "ai-search", "research"],
    featured: false,
    verified: true,
    configTemplate: {
      type: "local",
      command: ["npx", "-y", "exa-mcp-server"],
      environment: { EXA_API_KEY: "" },
    },
    configParams: [
      {
        key: "EXA_API_KEY",
        label: "Exa API Key",
        placeholder: "exa-...",
        required: true,
        secret: true,
      },
    ],
  },
  {
    slug: "todoist",
    name: "Todoist",
    description:
      "Manage tasks and projects in Todoist. Create, update, and complete tasks.",
    category: "productivity",
    icon: "ListTodo",
    author: "Community",
    serverType: "local",
    tags: ["tasks", "todo", "project-management"],
    featured: false,
    verified: false,
    configTemplate: {
      type: "local",
      command: ["npx", "-y", "todoist-mcp-server"],
      environment: { TODOIST_API_TOKEN: "" },
    },
    configParams: [
      {
        key: "TODOIST_API_TOKEN",
        label: "Todoist API Token",
        placeholder: "your-api-token",
        required: true,
        secret: true,
      },
    ],
  },
];
