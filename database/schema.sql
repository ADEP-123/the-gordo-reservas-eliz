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

create policy "Permitir creacion de mesas a usuarios autenticados"
on public.mesas
for insert
to authenticated
with check (true);

create policy "Permitir actualizacion de mesas a usuarios autenticados"
on public.mesas
for update
to authenticated
using (true)
with check (true);

notify pgrst, 'reload schema';

-- =========================================================
-- SEGURIDAD ADMIN Y FUNCIONES PUBLICAS CONTROLADAS
-- =========================================================

create extension if not exists "pgcrypto";

-- =========================================================
-- TABLA DE ADMINISTRADORES
-- =========================================================

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- =========================================================
-- FUNCION: verificar si el usuario actual es admin
-- =========================================================

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid()
      and au.activo = true
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- =========================================================
-- POLITICAS ADMIN_USERS
-- =========================================================

drop policy if exists "Permitir lectura de administradores a administradores"
on public.admin_users;

drop policy if exists "Permitir gestion de administradores a administradores"
on public.admin_users;

create policy "Permitir lectura de administradores a administradores"
on public.admin_users
for select
to authenticated
using (public.is_admin());

create policy "Permitir gestion de administradores a administradores"
on public.admin_users
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- =========================================================
-- POLITICAS DE MESAS
-- Cliente puede leer mesas.
-- Solo admin puede crear, editar o eliminar.
-- =========================================================

drop policy if exists "Permitir lectura publica de mesas"
on public.mesas;

drop policy if exists "Permitir creacion de mesas a usuarios autenticados"
on public.mesas;

drop policy if exists "Permitir actualizacion de mesas a usuarios autenticados"
on public.mesas;

drop policy if exists "Permitir creacion de mesas a administradores"
on public.mesas;

drop policy if exists "Permitir actualizacion de mesas a administradores"
on public.mesas;

drop policy if exists "Permitir eliminacion de mesas a administradores"
on public.mesas;

create policy "Permitir lectura publica de mesas"
on public.mesas
for select
to anon, authenticated
using (true);

create policy "Permitir creacion de mesas a administradores"
on public.mesas
for insert
to authenticated
with check (public.is_admin());

create policy "Permitir actualizacion de mesas a administradores"
on public.mesas
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Permitir eliminacion de mesas a administradores"
on public.mesas
for delete
to authenticated
using (public.is_admin());

-- =========================================================
-- POLITICAS DE HORARIOS
-- Cliente lee horarios activos.
-- Admin gestiona todos.
-- =========================================================

drop policy if exists "Permitir lectura publica de horarios"
on public.horarios;

drop policy if exists "Permitir lectura de horarios activos o admin"
on public.horarios;

drop policy if exists "Permitir gestion de horarios a administradores"
on public.horarios;

create policy "Permitir lectura de horarios activos o admin"
on public.horarios
for select
to anon, authenticated
using (activo = true or public.is_admin());

create policy "Permitir gestion de horarios a administradores"
on public.horarios
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- =========================================================
-- POLITICAS DE CONFIGURACION
-- Cliente lee configuración activa.
-- Admin puede editar.
-- =========================================================

drop policy if exists "Permitir lectura publica de configuracion de reservas"
on public.configuracion_reservas;

drop policy if exists "Permitir lectura de configuracion activa o admin"
on public.configuracion_reservas;

drop policy if exists "Permitir gestion de configuracion a administradores"
on public.configuracion_reservas;

create policy "Permitir lectura de configuracion activa o admin"
on public.configuracion_reservas
for select
to anon, authenticated
using (activo = true or public.is_admin());

create policy "Permitir gestion de configuracion a administradores"
on public.configuracion_reservas
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- =========================================================
-- POLITICAS DE CLIENTES
-- Ya no hay lectura pública directa.
-- El cliente reserva mediante RPC controlada.
-- Admin puede gestionar.
-- =========================================================

drop policy if exists "Permitir lectura publica de clientes"
on public.clientes;

drop policy if exists "Permitir registro publico de clientes"
on public.clientes;

drop policy if exists "Permitir actualizacion publica de clientes"
on public.clientes;

drop policy if exists "Permitir gestion de clientes a administradores"
on public.clientes;

create policy "Permitir gestion de clientes a administradores"
on public.clientes
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- =========================================================
-- POLITICAS DE RESERVAS
-- Ya no hay lectura ni creación pública directa.
-- El cliente reserva mediante RPC controlada.
-- Admin puede gestionar.
-- =========================================================

drop policy if exists "Permitir lectura publica de reservas"
on public.reservas;

drop policy if exists "Permitir creacion publica de reservas"
on public.reservas;

drop policy if exists "Permitir gestion de reservas a administradores"
on public.reservas;

create policy "Permitir gestion de reservas a administradores"
on public.reservas
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- =========================================================
-- FUNCION: disponibilidad de mesas segura
-- =========================================================

create or replace function public.get_mesas_con_disponibilidad(
  p_fecha date,
  p_hora time,
  p_num_personas integer
)
returns table (
  id uuid,
  numero integer,
  capacidad integer,
  ubicacion text,
  estado text,
  created_at timestamptz,
  disponible_para_criterio boolean,
  estado_original text,
  minimo_personas_requerido integer,
  motivo_no_disponibilidad text
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_duracion integer;
  v_ocupacion integer;
  v_hora_fin time;
begin
  select
    cr.duracion_reserva_minutos,
    cr.ocupacion_minima_porcentaje
  into
    v_duracion,
    v_ocupacion
  from public.configuracion_reservas cr
  where cr.nombre = 'global'
    and cr.activo = true
  limit 1;

  v_duracion := coalesce(v_duracion, 60);
  v_ocupacion := coalesce(v_ocupacion, 75);
  v_hora_fin := (p_hora + make_interval(mins => v_duracion))::time;

  return query
  with mesas_calculadas as (
    select
      m.id,
      m.numero,
      m.capacidad,
      m.ubicacion,
      m.estado as estado_original,
      m.created_at,
      ceil(m.capacidad * (v_ocupacion::numeric / 100))::integer as minimo_personas_requerido,
      exists (
        select 1
        from public.reservas r
        where r.mesa_id = m.id
          and r.fecha = p_fecha
          and r.estado = 'activa'
          and r.hora < v_hora_fin
          and p_hora < r.hora_fin
      ) as tiene_cruce
    from public.mesas m
  )
  select
    mc.id,
    mc.numero,
    mc.capacidad,
    mc.ubicacion,
    case
      when mc.estado_original = 'bloqueada' then 'bloqueada'
      when mc.estado_original = 'ocupada' then 'ocupada'
      when mc.tiene_cruce then 'ocupada'
      when p_num_personas > mc.capacidad then 'ocupada'
      when p_num_personas < mc.minimo_personas_requerido then 'ocupacion_baja'
      else 'disponible'
    end as estado,
    mc.created_at,
    (
      mc.estado_original = 'disponible'
      and mc.tiene_cruce = false
      and p_num_personas <= mc.capacidad
      and p_num_personas >= mc.minimo_personas_requerido
    ) as disponible_para_criterio,
    mc.estado_original,
    mc.minimo_personas_requerido,
    case
      when mc.estado_original = 'bloqueada' then 'Mesa bloqueada'
      when mc.estado_original = 'ocupada' then 'Mesa ocupada'
      when mc.tiene_cruce then 'Mesa reservada en ese horario'
      when p_num_personas > mc.capacidad then 'La mesa no tiene capacidad suficiente'
      when p_num_personas < mc.minimo_personas_requerido then
        'Requiere mínimo ' || mc.minimo_personas_requerido || ' personas'
      else null
    end as motivo_no_disponibilidad
  from mesas_calculadas mc
  order by mc.numero;
end;
$$;

grant execute on function public.get_mesas_con_disponibilidad(date, time, integer)
to anon, authenticated;

-- =========================================================
-- FUNCION: verificar una mesa puntual
-- =========================================================

create or replace function public.verificar_mesa_disponible(
  p_mesa_id uuid,
  p_fecha date,
  p_hora time,
  p_num_personas integer
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select g.disponible_para_criterio
      from public.get_mesas_con_disponibilidad(
        p_fecha,
        p_hora,
        p_num_personas
      ) g
      where g.id = p_mesa_id
      limit 1
    ),
    false
  );
$$;

grant execute on function public.verificar_mesa_disponible(uuid, date, time, integer)
to anon, authenticated;

-- =========================================================
-- FUNCION: crear reserva pública controlada
-- =========================================================

create or replace function public.crear_reserva_publica(
  p_mesa_id uuid,
  p_cliente_nombre text,
  p_cliente_tel text,
  p_cliente_email text,
  p_fecha date,
  p_hora time,
  p_num_personas integer,
  p_observaciones text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_mesa public.mesas%rowtype;
  v_horario public.horarios%rowtype;
  v_cliente_id uuid;
  v_reserva public.reservas%rowtype;
  v_duracion integer;
  v_ocupacion integer;
  v_minimo_personas integer;
  v_hora_fin time;
  v_email text;
  v_dia text;
begin
  if p_num_personas is null or p_num_personas <= 0 then
    raise exception 'El número de personas debe ser mayor a cero';
  end if;

  select *
  into v_mesa
  from public.mesas
  where id = p_mesa_id;

  if not found then
    raise exception 'La mesa seleccionada no existe';
  end if;

  select
    cr.duracion_reserva_minutos,
    cr.ocupacion_minima_porcentaje
  into
    v_duracion,
    v_ocupacion
  from public.configuracion_reservas cr
  where cr.nombre = 'global'
    and cr.activo = true
  limit 1;

  v_duracion := coalesce(v_duracion, 60);
  v_ocupacion := coalesce(v_ocupacion, 75);
  v_hora_fin := (p_hora + make_interval(mins => v_duracion))::time;
  v_minimo_personas := ceil(v_mesa.capacidad * (v_ocupacion::numeric / 100))::integer;

  v_dia := (
    array[
      'domingo',
      'lunes',
      'martes',
      'miercoles',
      'jueves',
      'viernes',
      'sabado'
    ]
  )[extract(dow from p_fecha)::integer + 1];

  select *
  into v_horario
  from public.horarios h
  where h.dia_semana = v_dia
    and h.activo = true
  limit 1;

  if not found then
    raise exception 'No hay horario habilitado para esta fecha';
  end if;

  if p_hora < v_horario.hora_inicio or v_hora_fin > v_horario.hora_fin then
    raise exception 'La reserva está fuera del horario del restaurante';
  end if;

  if v_mesa.estado <> 'disponible' then
    raise exception 'La mesa no está disponible';
  end if;

  if p_num_personas > v_mesa.capacidad then
    raise exception 'La mesa no tiene capacidad suficiente';
  end if;

  if p_num_personas < v_minimo_personas then
    raise exception 'La mesa requiere mínimo % personas', v_minimo_personas;
  end if;

  if exists (
    select 1
    from public.reservas r
    where r.mesa_id = p_mesa_id
      and r.fecha = p_fecha
      and r.estado = 'activa'
      and r.hora < v_hora_fin
      and p_hora < r.hora_fin
  ) then
    raise exception 'Mesa no disponible para ese rango horario';
  end if;

  v_email := nullif(lower(trim(coalesce(p_cliente_email, ''))), '');

  select c.id
  into v_cliente_id
  from public.clientes c
  where c.cliente_tel = trim(p_cliente_tel)
  limit 1;

  if v_cliente_id is null and v_email is not null then
    select c.id
    into v_cliente_id
    from public.clientes c
    where lower(c.cliente_email) = v_email
    limit 1;
  end if;

  if v_cliente_id is null then
    insert into public.clientes (
      cliente_nombre,
      cliente_tel,
      cliente_email
    )
    values (
      trim(p_cliente_nombre),
      trim(p_cliente_tel),
      v_email
    )
    returning id into v_cliente_id;
  else
    update public.clientes
    set
      cliente_nombre = trim(p_cliente_nombre),
      cliente_tel = trim(p_cliente_tel),
      cliente_email = v_email
    where id = v_cliente_id;
  end if;

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
  )
  values (
    p_mesa_id,
    v_cliente_id,
    p_fecha,
    p_hora,
    v_hora_fin,
    v_duracion,
    p_num_personas,
    nullif(trim(coalesce(p_observaciones, '')), ''),
    'activa'
  )
  returning * into v_reserva;

  return jsonb_build_object(
    'id', v_reserva.id,
    'mesa_id', v_reserva.mesa_id,
    'cliente_id', v_reserva.cliente_id,
    'fecha', v_reserva.fecha,
    'hora', v_reserva.hora,
    'hora_fin', v_reserva.hora_fin,
    'duracion_minutos', v_reserva.duracion_minutos,
    'num_personas', v_reserva.num_personas,
    'observaciones', v_reserva.observaciones,
    'estado', v_reserva.estado,
    'created_at', v_reserva.created_at,
    'mesas', jsonb_build_object(
      'numero', v_mesa.numero,
      'capacidad', v_mesa.capacidad,
      'ubicacion', v_mesa.ubicacion
    ),
    'clientes', jsonb_build_object(
      'cliente_nombre', trim(p_cliente_nombre),
      'cliente_tel', trim(p_cliente_tel),
      'cliente_email', v_email
    )
  );
end;
$$;

grant execute on function public.crear_reserva_publica(
  uuid,
  text,
  text,
  text,
  date,
  time,
  integer,
  text
)
to anon, authenticated;

-- =========================================================
-- FUNCION: sugerir siguiente horario disponible
-- =========================================================

create or replace function public.buscar_siguiente_horario_disponible(
  p_fecha date,
  p_hora time,
  p_num_personas integer
)
returns table (
  fecha date,
  hora time,
  hora_fin time,
  num_personas integer,
  mesas_disponibles bigint,
  asientos_disponibles bigint
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_config public.configuracion_reservas%rowtype;
  v_horario public.horarios%rowtype;
  v_dia text;
  v_apertura integer;
  v_cierre integer;
  v_actual integer;
  v_intervalo integer;
  v_hora time;
  v_hora_fin time;
  v_mesas bigint;
  v_asientos bigint;
begin
  select *
  into v_config
  from public.configuracion_reservas cr
  where cr.nombre = 'global'
    and cr.activo = true
  limit 1;

  if not found then
    return;
  end if;

  v_dia := (
    array[
      'domingo',
      'lunes',
      'martes',
      'miercoles',
      'jueves',
      'viernes',
      'sabado'
    ]
  )[extract(dow from p_fecha)::integer + 1];

  select *
  into v_horario
  from public.horarios h
  where h.dia_semana = v_dia
    and h.activo = true
  limit 1;

  if not found then
    return;
  end if;

  v_intervalo := v_config.intervalo_horarios_minutos;

  v_apertura :=
    extract(hour from v_horario.hora_inicio)::integer * 60
    + extract(minute from v_horario.hora_inicio)::integer;

  v_cierre :=
    extract(hour from v_horario.hora_fin)::integer * 60
    + extract(minute from v_horario.hora_fin)::integer;

  v_actual :=
    extract(hour from p_hora)::integer * 60
    + extract(minute from p_hora)::integer
    + v_intervalo;

  v_actual := greatest(v_actual, v_apertura);
  v_actual := ceil(v_actual::numeric / v_intervalo)::integer * v_intervalo;

  while v_actual + v_config.duracion_reserva_minutos <= v_cierre loop
    v_hora := make_time((v_actual / 60)::integer, (v_actual % 60)::integer, 0);
    v_hora_fin := (
      v_hora + make_interval(mins => v_config.duracion_reserva_minutos)
    )::time;

    select
      count(*),
      coalesce(sum(g.capacidad), 0)
    into
      v_mesas,
      v_asientos
    from public.get_mesas_con_disponibilidad(
      p_fecha,
      v_hora,
      p_num_personas
    ) g
    where g.disponible_para_criterio = true;

    if v_mesas > 0 then
      fecha := p_fecha;
      hora := v_hora;
      hora_fin := v_hora_fin;
      num_personas := p_num_personas;
      mesas_disponibles := v_mesas;
      asientos_disponibles := v_asientos;
      return next;
      return;
    end if;

    v_actual := v_actual + v_intervalo;
  end loop;

  return;
end;
$$;

grant execute on function public.buscar_siguiente_horario_disponible(
  date,
  time,
  integer
)
to anon, authenticated;

notify pgrst, 'reload schema';

insert into public.admin_users (user_id, email, activo)
select id, email, true
from auth.users
where email = 'admin@thegordo.com'
on conflict (user_id) do update
set
  email = excluded.email,
  activo = true;