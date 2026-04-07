<div align="center">

# 🎓 EduRate

**Plataforma web de evaluación docente universitaria, anónima y confiable.**

[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://edurate-zeta.vercel.app)
[![Supabase](https://img.shields.io/badge/Backend-Supabase-blue?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Next.js](https://img.shields.io/badge/Framework-Next.js%2015-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[🌐 Explorar la aplicación](https://edurate-zeta.vercel.app) • [🛠️ Reportar un error](https://github.com/alowincr/edurate/issues)

---
</div>

## ✨ Características

- 🔒 **Autenticación por correo institucional** — Magic Link sin contraseñas
- ⭐ **6 criterios de evaluación** — Claridad, Dominio, Metodología, Puntualidad, Trato y Exigencia
- 🛡️ **Sistema anti-tóxico automático** — Detecta y elimina lenguaje ofensivo
- 📊 **Ranking de profesores** — Top mejores y peores valorados
- 👤 **Panel del estudiante** — Ver, editar y eliminar tus evaluaciones
- 🚩 **Sistema de reportes** — Los usuarios pueden reportar comentarios inapropiados
- 🔍 **Búsqueda y filtros** — Por nombre y universidad
- 📱 **Responsive** — Funciona en móvil y desktop

## 🛠️ Tecnologías

| Tecnología | Uso |
|---|---|
| [Next.js 15](https://nextjs.org/) | Framework fullstack (frontend + API routes) |
| [TypeScript](https://www.typescriptlang.org/) | Tipado estático |
| [Tailwind CSS v4](https://tailwindcss.com/) | Estilos y diseño |
| [Supabase](https://supabase.com/) | Base de datos PostgreSQL + Autenticación |
| [@supabase/ssr](https://supabase.com/docs/guides/auth/server-side) | Manejo de sesiones SSR |
| [Vercel](https://vercel.com/) | Deploy y hosting |

## 📸 Capturas de pantalla

<div align="center">
  <img src="public/screenshots/dashboard_edurate.png" alt="Dashboard Principal" width="80%" />
  <br />
  <p><i>📊 Panel Principal (Dashboard) - Resumen de actividad.</i></p>
  
  <br />
  <hr />
  <br />

  <img src="public/screenshots/evaluar_edurate.png" alt="Formulario de Evaluación" width="75%" />
  <br />
  <p><i>⭐ Formulario de Evaluación Detallada - Criterios y moderación.</i></p>

  <br />
  <hr />
  <br />

  <table width="100%">
    <tr>
      <td width="50%" align="center">
        <img src="public/screenshots/ranking_edurate.png" alt="Ranking" width="100%" />
        <br />
        <b>🏆 Ranking de Profesores</b>
      </td>
      <td width="50%" align="center">
        <img src="public/screenshots/profesores_edurate.png" alt="Lista de Profesores" width="100%" />
        <br />
        <b>🔍 Búsqueda de Docentes</b>
      </td>
    </tr>
  </table>
  
  <br />

  <table width="100%">
    <tr>
      <td align="center">
        <img src="public/screenshots/registrar_edurate.png" alt="Registrar Profesor" width="60%" />
        <br />
        <b>📝 Registro de Profesores</b>
      </td>
    </tr>
  </table>
</div>

## 📁 Estructura del proyecto
edurate/
├── app/
│   ├── page.tsx              # Landing page
│   ├── auth/                 # Login y registro
│   ├── professors/           # Lista y perfil de profesores
│   ├── dashboard/            # Panel del estudiante
│   ├── ranking/              # Ranking de profesores
│   ├── profile/              # Perfil del usuario
│   ├── admin/                # Panel de administración
│   └── api/                  # API Routes (REST)
│       ├── auth/             # me, logout, sync
│       ├── professors/       # CRUD de profesores
│       ├── evaluations/      # Crear, editar, eliminar
│       ├── reports/          # Sistema de reportes
│       ├── profile/          # Actualizar perfil
│       └── admin/            # Gestión de reportes
├── components/               # Componentes reutilizables
│   ├── Navbar.tsx
│   ├── EvaluationForm.tsx
│   ├── DashboardClient.tsx
│   ├── RankCard.tsx
│   ├── ReportButton.tsx
│   └── ProfileClient.tsx
└── lib/
├── supabase.ts           # Cliente público
├── supabase-admin.ts     # Cliente servidor
├── session.ts            # Manejo de sesión
├── auth.ts               # Validación de correo institucional
└── moderation.ts         # Sistema anti-tóxico

## 🚀 Instalación local

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/edurate.git
cd edurate
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y rellena con tus valores:
```bash
cp .env.example .env.local
```
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
ALLOWED_EMAIL_DOMAINS=utp.edu.pe,unmsm.edu.pe,uni.edu.pe,pucp.edu.pe,upc.edu.pe
```

### 4. Configurar la base de datos

Ejecuta el schema SQL en **Supabase → SQL Editor**:
```sql
-- Habilitar extensiones
create extension if not exists "uuid-ossp";

-- Tabla usuarios
create table users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  full_name text,
  university text,
  is_verified boolean default false,
  is_admin boolean default false,
  created_at timestamptz default now()
);

-- Tabla profesores
create table professors (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  university text not null,
  department text,
  photo_url text,
  avg_rating numeric(3,2) default 0,
  total_evaluations int default 0,
  created_at timestamptz default now()
);

-- Tabla cursos
create table courses (
  id uuid primary key default uuid_generate_v4(),
  professor_id uuid references professors(id) on delete cascade,
  name text not null,
  code text
);

-- Tabla evaluaciones
create table evaluations (
  id uuid primary key default uuid_generate_v4(),
  professor_id uuid references professors(id) on delete cascade,
  user_id uuid references users(id) on delete set null,
  clarity int check (clarity between 1 and 5),
  knowledge int check (knowledge between 1 and 5),
  methodology int check (methodology between 1 and 5),
  punctuality int check (punctuality between 1 and 5),
  treatment int check (treatment between 1 and 5),
  rigor int check (rigor between 1 and 5),
  avg_score numeric(3,2),
  comment text,
  is_approved boolean default true,
  is_flagged boolean default false,
  flag_reason text,
  reported_count int default 0,
  moderated_at timestamptz,
  created_at timestamptz default now()
);

-- Índice para evitar evaluaciones duplicadas
create unique index one_eval_per_professor
  on evaluations(user_id, professor_id);

-- Tabla reportes
create table reports (
  id uuid primary key default uuid_generate_v4(),
  evaluation_id uuid references evaluations(id) on delete cascade,
  reporter_user_id uuid references users(id) on delete set null,
  reason text not null,
  details text,
  status text default 'pending' check (status in ('pending', 'reviewed', 'dismissed')),
  created_at timestamptz default now()
);

-- Trigger para actualizar promedio del profesor
create or replace function update_professor_avg()
returns trigger as $$
begin
  update professors
  set
    avg_rating = coalesce(
      (select round(avg(avg_score)::numeric, 2)
       from evaluations
       where professor_id = coalesce(NEW.professor_id, OLD.professor_id)
       and is_approved = true),
      0
    ),
    total_evaluations = (
      select count(*) from evaluations
      where professor_id = coalesce(NEW.professor_id, OLD.professor_id)
      and is_approved = true
    )
  where id = coalesce(NEW.professor_id, OLD.professor_id);
  return coalesce(NEW, OLD);
end;
$$ language plpgsql;

create trigger trigger_update_avg
after insert or update or delete on evaluations
for each row execute function update_professor_avg();

-- Función para incrementar reportes
create or replace function increment_report_count(eval_id uuid)
returns void as $$
begin
  update evaluations
  set reported_count = coalesce(reported_count, 0) + 1
  where id = eval_id;
end;
$$ language plpgsql;

-- 🔐 Configuración de Seguridad (Row Level Security)
-- Habilitar RLS en todas las tablas para proteger la integridad de los datos
alter table users enable row level security;
alter table professors enable row level security;
alter table courses enable row level security;
alter table evaluations enable row level security;
alter table reports enable row level security;

-- Políticas de Lectura (Públicas)
create policy "Lectura pública de profesores" on professors for select using (true);
create policy "Lectura pública de cursos" on courses for select using (true);
create policy "Evaluaciones aprobadas son públicas" on evaluations for select using (is_approved = true);

-- Políticas de Escritura (Solo usuarios autenticados)
create policy "Usuarios verificados pueden registrar profesores" 
  on professors for insert 
  with check (auth.role() = 'authenticated');

create policy "Usuarios pueden crear sus propias evaluaciones" 
  on evaluations for insert 
  with check (auth.role() = 'authenticated' and auth.uid()::text = user_id::text);

-- Políticas de Modificación (Solo el autor)
create policy "Usuarios pueden editar su propia evaluación" 
  on evaluations for update 
  using (auth.uid()::text = user_id::text);

create policy "Usuarios pueden borrar su propia evaluación" 
  on evaluations for delete 
  using (auth.uid()::text = user_id::text);
```

### 5. Correr el proyecto
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 🔐 Variables de entorno

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto en Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave privada de Supabase (solo servidor) |
| `NEXT_PUBLIC_APP_URL` | URL base de la app |
| `ALLOWED_EMAIL_DOMAINS` | Dominios de correo permitidos, separados por coma |

## 👤 Roles de usuario

| Rol | Permisos |
|---|---|
| **Estudiante verificado** | Registrar profesores, evaluar, editar y eliminar sus evaluaciones, reportar comentarios |
| **Administrador** | Todo lo anterior + ver y gestionar reportes en `/admin` |

Para hacer un usuario administrador:
```sql
update users set is_admin = true where email = 'correo@universidad.edu.pe';
```

## 🌐 Deploy en Vercel

1. Sube el proyecto a GitHub
2. Importa el repositorio en [vercel.com](https://vercel.com)
3. Agrega las variables de entorno en Vercel
4. Haz deploy
5. Actualiza las URLs en **Supabase → Authentication → URL Configuration**:
   - Site URL: `https://tu-app.vercel.app`
   - Redirect URLs: `https://tu-app.vercel.app/auth/callback`

## 📄 Licencia

Este proyecto está bajo la licencia MIT.  
Puedes usarlo, modificarlo y distribuirlo libremente, siempre que se incluya el crédito al autor.

--- 

