import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import type { News, Event } from "@/lib/types";
import { mockEvents, mockNews } from "@/lib/data/mock";

/*
 * Simple JSON file storage for development.
 * In production, replace with Supabase.
 *
 * Data files are stored in /data at project root.
 */

const DATA_DIR = join(process.cwd(), "data");

function ensureDir() {
  const { mkdirSync } = require("fs");
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

// --- Eventos ---

export function getEventos(): Event[] {
  ensureDir();
  const file = join(DATA_DIR, "eventos.json");
  if (!existsSync(file)) {
    writeFileSync(file, JSON.stringify(mockEvents, null, 2));
  }
  return JSON.parse(readFileSync(file, "utf-8"));
}

export function saveEventos(eventos: Event[]) {
  ensureDir();
  writeFileSync(join(DATA_DIR, "eventos.json"), JSON.stringify(eventos, null, 2));
}

export function getEvento(id: string): Event | undefined {
  return getEventos().find((e) => e.id === id);
}

export function createEvento(evento: Event): Event {
  const eventos = getEventos();
  eventos.push(evento);
  saveEventos(eventos);
  return evento;
}

export function updateEvento(id: string, updates: Partial<Event>): Event | null {
  const eventos = getEventos();
  const idx = eventos.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  eventos[idx] = { ...eventos[idx], ...updates };
  saveEventos(eventos);
  return eventos[idx];
}

export function deleteEvento(id: string): boolean {
  const eventos = getEventos();
  const filtered = eventos.filter((e) => e.id !== id);
  if (filtered.length === eventos.length) return false;
  saveEventos(filtered);
  return true;
}

// --- Noticias ---

export function getNoticias(): News[] {
  ensureDir();
  const file = join(DATA_DIR, "noticias.json");
  if (!existsSync(file)) {
    writeFileSync(file, JSON.stringify(mockNews, null, 2));
  }
  return JSON.parse(readFileSync(file, "utf-8"));
}

export function saveNoticias(noticias: News[]) {
  ensureDir();
  writeFileSync(join(DATA_DIR, "noticias.json"), JSON.stringify(noticias, null, 2));
}

export function getNoticia(id: string): News | undefined {
  return getNoticias().find((n) => n.id === id);
}

export function createNoticia(noticia: News): News {
  const noticias = getNoticias();
  noticias.push(noticia);
  saveNoticias(noticias);
  return noticia;
}

export function updateNoticia(id: string, updates: Partial<News>): News | null {
  const noticias = getNoticias();
  const idx = noticias.findIndex((n) => n.id === id);
  if (idx === -1) return null;
  noticias[idx] = { ...noticias[idx], ...updates };
  saveNoticias(noticias);
  return noticias[idx];
}

export function deleteNoticia(id: string): boolean {
  const noticias = getNoticias();
  const filtered = noticias.filter((n) => n.id !== id);
  if (filtered.length === noticias.length) return false;
  saveNoticias(filtered);
  return true;
}
