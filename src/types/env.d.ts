// Typed declarations for EXPO_PUBLIC_* environment variables.
// Babel inlines these at build time; TypeScript needs this declaration
// because the project's lib targets (DOM + ESNext) don't include Node.js globals.
declare const process: {
  env: {
    readonly EXPO_PUBLIC_SUPABASE_URL: string;
    readonly EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
  };
};
