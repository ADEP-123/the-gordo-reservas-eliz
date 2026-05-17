-- =========================================================
-- RESET DEL ESQUEMA
-- Sistema de Reservas de Mesas - The Gordo
-- =========================================================

drop table if exists public.reservas cascade;
drop table if exists public.clientes cascade;
drop table if exists public.horarios cascade;
drop table if exists public.mesas cascade;
drop table if exists public.configuracion_reservas cascade;

create extension if not exists "pgcrypto";

-- =========================================================
-- TABLA: mesas
-- =========================================================

create table public.mesas (
  id uuid primary key default gen_random_uuid(),
  numero integer not null unique,
  capacidad integer not null check (capacidad > 0),
  ubicacion text not null,
  estado text not null default 'disponible'
    check (estado in ('disponible', 'ocupada', 'bloqueada')),
  created_at timestamptz not null default now()
);

-- =========================================================
-- TABLA: clientes
-- Normaliza los datos del cliente para no repetirlos
-- en cada reserva.
-- =========================================================

create table public.clientes (
  id uuid primary key default gen_random_uuid(),
  cliente_nombre text not null,
  cliente_tel text not null unique,
  cliente_email text,
  created_at timestamptz not null default now()
);

create unique index clientes_email_unique
on public.clientes (lower(cliente_email))
where cliente_email is not null and cliente_email <> '';

-- =========================================================
-- TABLA: reservas
-- Mantiene nombres base del documento y agrega duración,
-- hora_fin y observaciones.
-- =========================================================

create table public.reservas (
  id uuid primary key default gen_random_uuid(),

  mesa_id uuid not null references public.mesas(id) on delete restrict,
  cliente_id uuid not null references public.clientes(id) on delete restrict,

  fecha date not null,
  hora time not null,
  hora_fin time not null,
  duracion_minutos integer not null check (duracion_minutos > 0),

  num_personas integer not null check (num_personas > 0),
  observaciones text,

  estado text not null default 'activa'
    check (estado in ('activa', 'cancelada', 'completada')),

  created_at timestamptz not null default now(),

  constraint reserva_hora_fin_mayor_hora check (hora_fin > hora)
);

create index reservas_mesa_fecha_idx
on public.reservas (mesa_id, fecha);

create index reservas_estado_idx
on public.reservas (estado);

create index reservas_cliente_idx
on public.reservas (cliente_id);

-- =========================================================
-- TABLA: horarios
-- Horarios globales del restaurante.
-- =========================================================

create table public.horarios (
  id uuid primary key default gen_random_uuid(),
  dia_semana text not null,
  hora_inicio time not null,
  hora_fin time not null,
  activo boolean not null default true,

  constraint horario_hora_fin_mayor_inicio check (hora_fin > hora_inicio)
);

-- =========================================================
-- TABLA: configuracion_reservas
-- Permite que el administrador defina duración e intervalo.
-- =========================================================

create table public.configuracion_reservas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique default 'global',

  duracion_reserva_minutos integer not null default 60
    check (duracion_reserva_minutos > 0),

  intervalo_horarios_minutos integer not null default 30
    check (intervalo_horarios_minutos > 0),

  activo boolean not null default true,
  updated_at timestamptz not null default now()
);

-- =========================================================
-- DATOS INICIALES
-- =========================================================

insert into public.mesas (numero, capacidad, ubicacion, estado) values
  (1, 2, 'Zona ventana', 'disponible'),
  (2, 4, 'Zona ventana', 'disponible'),
  (3, 4, 'Zona central', 'disponible'),
  (4, 6, 'Zona central', 'disponible'),
  (5, 2, 'Zona central', 'disponible'),
  (6, 6, 'Terraza', 'disponible'),
  (7, 8, 'Terraza', 'disponible');

insert into public.horarios (dia_semana, hora_inicio, hora_fin, activo) values
  ('lunes', '12:00', '22:00', true),
  ('martes', '12:00', '22:00', true),
  ('miercoles', '12:00', '22:00', true),
  ('jueves', '12:00', '22:00', true),
  ('viernes', '12:00', '23:00', true),
  ('sabado', '12:00', '23:00', true),
  ('domingo', '12:00', '22:00', true);

insert into public.configuracion_reservas (
  nombre,
  duracion_reserva_minutos,
  intervalo_horarios_minutos,
  activo
) values (
  'global',
  60,
  30,
  true
);

-- =========================================================
-- RLS Y POLÍTICAS BÁSICAS PARA EL MÓDULO CLIENTE
-- =========================================================

alter table public.mesas enable row level security;
alter table public.clientes enable row level security;
alter table public.reservas enable row level security;
alter table public.horarios enable row level security;
alter table public.configuracion_reservas enable row level security;

create policy "Permitir lectura publica de mesas"
on public.mesas
for select
using (true);

create policy "Permitir lectura publica de horarios"
on public.horarios
for select
using (true);

create policy "Permitir lectura publica de configuracion de reservas"
on public.configuracion_reservas
for select
using (true);

create policy "Permitir lectura publica de clientes"
on public.clientes
for select
using (true);

create policy "Permitir registro publico de clientes"
on public.clientes
for insert
with check (true);

create policy "Permitir actualizacion publica de clientes"
on public.clientes
for update
using (true)
with check (true);

create policy "Permitir lectura publica de reservas"
on public.reservas
for select
using (true);

create policy "Permitir creacion publica de reservas"
on public.reservas
for insert
with check (true);

-- Recargar caché de esquema de PostgREST/Supabase
notify pgrst, 'reload schema';

-- =========================================================
-- DATOS DE PRUEBA
-- Sistema de Reservas de Mesas - The Gordo
-- =========================================================

-- Limpia solo datos transaccionales.
-- No borra mesas, horarios ni configuración.
truncate table public.reservas, public.clientes restart identity cascade;

-- Asegurar configuración global
insert into public.configuracion_reservas (
  nombre,
  duracion_reserva_minutos,
  intervalo_horarios_minutos,
  activo
)
values (
  'global',
  60,
  30,
  true
)
on conflict (nombre) do update
set
  duracion_reserva_minutos = excluded.duracion_reserva_minutos,
  intervalo_horarios_minutos = excluded.intervalo_horarios_minutos,
  activo = excluded.activo,
  updated_at = now();

-- Asegurar mesas de prueba
insert into public.mesas (numero, capacidad, ubicacion, estado) values
  (1, 2, 'Zona ventana', 'disponible'),
  (2, 4, 'Zona ventana', 'disponible'),
  (3, 4, 'Zona central', 'disponible'),
  (4, 6, 'Zona central', 'disponible'),
  (5, 2, 'Zona central', 'disponible'),
  (6, 6, 'Terraza', 'disponible'),
  (7, 8, 'Terraza', 'disponible')
on conflict (numero) do update
set
  capacidad = excluded.capacidad,
  ubicacion = excluded.ubicacion,
  estado = excluded.estado;

-- Clientes de prueba
insert into public.clientes (
  cliente_nombre,
  cliente_tel,
  cliente_email
) values
  ('María Gómez', '3001234567', 'maria.gomez@email.com'),
  ('Carlos Pérez', '3019876543', 'carlos.perez@email.com'),
  ('Laura Martínez', '3025557788', 'laura.martinez@email.com'),
  ('Andrés Rojas', '3104443322', 'andres.rojas@email.com'),
  ('Sofía Ramírez', '3118889900', 'sofia.ramirez@email.com')
on conflict (cliente_tel) do update
set
  cliente_nombre = excluded.cliente_nombre,
  cliente_email = excluded.cliente_email;

-- Reservas de prueba
-- Fecha sugerida para probar: 2026-06-10
-- Duración: 60 minutos

insert into public.reservas (
  mesa_id,
  cliente_id,
  fecha,
  hora,
  hora_fin,
  duracion_minutos,
  num_personas,
  observaciones,
  estado
) values
  (
    (select id from public.mesas where numero = 1),
    (select id from public.clientes where cliente_tel = '3001234567'),
    '2026-06-10',
    '19:00',
    '20:00',
    60,
    2,
    'Cliente solicita mesa cerca de la ventana.',
    'activa'
  ),
  (
    (select id from public.mesas where numero = 3),
    (select id from public.clientes where cliente_tel = '3019876543'),
    '2026-06-10',
    '19:30',
    '20:30',
    60,
    4,
    'Celebración de cumpleaños.',
    'activa'
  ),
  (
    (select id from public.mesas where numero = 6),
    (select id from public.clientes where cliente_tel = '3025557788'),
    '2026-06-10',
    '20:00',
    '21:00',
    60,
    5,
    'Prefieren terraza.',
    'activa'
  ),
  (
    (select id from public.mesas where numero = 4),
    (select id from public.clientes where cliente_tel = '3104443322'),
    '2026-06-11',
    '18:00',
    '19:00',
    60,
    6,
    'Reserva familiar.',
    'activa'
  ),
  (
    (select id from public.mesas where numero = 7),
    (select id from public.clientes where cliente_tel = '3118889900'),
    '2026-06-11',
    '21:00',
    '22:00',
    60,
    8,
    'Grupo grande, prefieren exterior.',
    'activa'
  );

-- Recargar caché de esquema
notify pgrst, 'reload schema';

alter table public.configuracion_reservas
add column if not exists ocupacion_minima_porcentaje integer not null default 75
check (ocupacion_minima_porcentaje > 0 and ocupacion_minima_porcentaje <= 100);

update public.configuracion_reservas
set ocupacion_minima_porcentaje = 75
where nombre = 'global';

notify pgrst, 'reload schema';