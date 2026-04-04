-- ============================================================
-- SAFE SEED DATA — No explicit IDs, no sequence conflicts
-- Uses INSERT ... WHERE NOT EXISTS (idempotent on restarts)
-- H2 auto-generates IDs; sequence persists in the file DB.
-- ============================================================

-- Perfiles
INSERT INTO perfiles (str_nombre_perfil, bit_administrador)
    SELECT 'Administrador', true
    WHERE NOT EXISTS (SELECT 1 FROM perfiles WHERE str_nombre_perfil = 'Administrador');

INSERT INTO perfiles (str_nombre_perfil, bit_administrador)
    SELECT 'Usuario', false
    WHERE NOT EXISTS (SELECT 1 FROM perfiles WHERE str_nombre_perfil = 'Usuario');

-- Modulos
INSERT INTO modulos (str_nombre_modulo)
    SELECT 'Perfil' WHERE NOT EXISTS (SELECT 1 FROM modulos WHERE str_nombre_modulo = 'Perfil');
INSERT INTO modulos (str_nombre_modulo)
    SELECT 'Usuario' WHERE NOT EXISTS (SELECT 1 FROM modulos WHERE str_nombre_modulo = 'Usuario');
INSERT INTO modulos (str_nombre_modulo)
    SELECT 'Modulo' WHERE NOT EXISTS (SELECT 1 FROM modulos WHERE str_nombre_modulo = 'Modulo');
INSERT INTO modulos (str_nombre_modulo)
    SELECT 'Permisos-Perfil' WHERE NOT EXISTS (SELECT 1 FROM modulos WHERE str_nombre_modulo = 'Permisos-Perfil');
INSERT INTO modulos (str_nombre_modulo)
    SELECT 'Principal 1.1' WHERE NOT EXISTS (SELECT 1 FROM modulos WHERE str_nombre_modulo = 'Principal 1.1');
INSERT INTO modulos (str_nombre_modulo)
    SELECT 'Principal 1.2' WHERE NOT EXISTS (SELECT 1 FROM modulos WHERE str_nombre_modulo = 'Principal 1.2');
INSERT INTO modulos (str_nombre_modulo)
    SELECT 'Principal 2.1' WHERE NOT EXISTS (SELECT 1 FROM modulos WHERE str_nombre_modulo = 'Principal 2.1');
INSERT INTO modulos (str_nombre_modulo)
    SELECT 'Principal 2.2' WHERE NOT EXISTS (SELECT 1 FROM modulos WHERE str_nombre_modulo = 'Principal 2.2');

-- Permisos for Administrador: all modules (references by name to avoid ID dependency)
INSERT INTO permisos_perfil (id_modulo, id_perfil, bit_agregar, bit_editar, bit_consulta, bit_eliminar, bit_detalle)
    SELECT md.id, pf.id, true, true, true, true, true
    FROM modulos md, perfiles pf
    WHERE md.str_nombre_modulo = 'Perfil'
      AND pf.str_nombre_perfil = 'Administrador'
      AND NOT EXISTS (
          SELECT 1 FROM permisos_perfil pp
          WHERE pp.id_modulo = md.id AND pp.id_perfil = pf.id
      );

INSERT INTO permisos_perfil (id_modulo, id_perfil, bit_agregar, bit_editar, bit_consulta, bit_eliminar, bit_detalle)
    SELECT md.id, pf.id, true, true, true, true, true
    FROM modulos md, perfiles pf
    WHERE md.str_nombre_modulo = 'Usuario'
      AND pf.str_nombre_perfil = 'Administrador'
      AND NOT EXISTS (
          SELECT 1 FROM permisos_perfil pp
          WHERE pp.id_modulo = md.id AND pp.id_perfil = pf.id
      );

INSERT INTO permisos_perfil (id_modulo, id_perfil, bit_agregar, bit_editar, bit_consulta, bit_eliminar, bit_detalle)
    SELECT md.id, pf.id, true, true, true, true, true
    FROM modulos md, perfiles pf
    WHERE md.str_nombre_modulo = 'Modulo'
      AND pf.str_nombre_perfil = 'Administrador'
      AND NOT EXISTS (
          SELECT 1 FROM permisos_perfil pp
          WHERE pp.id_modulo = md.id AND pp.id_perfil = pf.id
      );

INSERT INTO permisos_perfil (id_modulo, id_perfil, bit_agregar, bit_editar, bit_consulta, bit_eliminar, bit_detalle)
    SELECT md.id, pf.id, true, true, true, true, true
    FROM modulos md, perfiles pf
    WHERE md.str_nombre_modulo = 'Permisos-Perfil'
      AND pf.str_nombre_perfil = 'Administrador'
      AND NOT EXISTS (
          SELECT 1 FROM permisos_perfil pp
          WHERE pp.id_modulo = md.id AND pp.id_perfil = pf.id
      );

INSERT INTO permisos_perfil (id_modulo, id_perfil, bit_agregar, bit_editar, bit_consulta, bit_eliminar, bit_detalle)
    SELECT md.id, pf.id, true, true, true, true, true
    FROM modulos md, perfiles pf
    WHERE md.str_nombre_modulo = 'Principal 1.1'
      AND pf.str_nombre_perfil = 'Administrador'
      AND NOT EXISTS (
          SELECT 1 FROM permisos_perfil pp
          WHERE pp.id_modulo = md.id AND pp.id_perfil = pf.id
      );

INSERT INTO permisos_perfil (id_modulo, id_perfil, bit_agregar, bit_editar, bit_consulta, bit_eliminar, bit_detalle)
    SELECT md.id, pf.id, true, true, true, true, true
    FROM modulos md, perfiles pf
    WHERE md.str_nombre_modulo = 'Principal 1.2'
      AND pf.str_nombre_perfil = 'Administrador'
      AND NOT EXISTS (
          SELECT 1 FROM permisos_perfil pp
          WHERE pp.id_modulo = md.id AND pp.id_perfil = pf.id
      );

INSERT INTO permisos_perfil (id_modulo, id_perfil, bit_agregar, bit_editar, bit_consulta, bit_eliminar, bit_detalle)
    SELECT md.id, pf.id, true, true, true, true, true
    FROM modulos md, perfiles pf
    WHERE md.str_nombre_modulo = 'Principal 2.1'
      AND pf.str_nombre_perfil = 'Administrador'
      AND NOT EXISTS (
          SELECT 1 FROM permisos_perfil pp
          WHERE pp.id_modulo = md.id AND pp.id_perfil = pf.id
      );

INSERT INTO permisos_perfil (id_modulo, id_perfil, bit_agregar, bit_editar, bit_consulta, bit_eliminar, bit_detalle)
    SELECT md.id, pf.id, true, true, true, true, true
    FROM modulos md, perfiles pf
    WHERE md.str_nombre_modulo = 'Principal 2.2'
      AND pf.str_nombre_perfil = 'Administrador'
      AND NOT EXISTS (
          SELECT 1 FROM permisos_perfil pp
          WHERE pp.id_modulo = md.id AND pp.id_perfil = pf.id
      );

-- Menus: root categories
INSERT INTO menus (id_menu_padre, str_nombre_menu, id_modulo)
    SELECT 0, 'Seguridad', NULL
    WHERE NOT EXISTS (SELECT 1 FROM menus WHERE str_nombre_menu = 'Seguridad' AND id_menu_padre = 0);

INSERT INTO menus (id_menu_padre, str_nombre_menu, id_modulo)
    SELECT 0, 'Principal 1', NULL
    WHERE NOT EXISTS (SELECT 1 FROM menus WHERE str_nombre_menu = 'Principal 1' AND id_menu_padre = 0);

INSERT INTO menus (id_menu_padre, str_nombre_menu, id_modulo)
    SELECT 0, 'Principal 2', NULL
    WHERE NOT EXISTS (SELECT 1 FROM menus WHERE str_nombre_menu = 'Principal 2' AND id_menu_padre = 0);

-- Submenus of Seguridad
INSERT INTO menus (id_menu_padre, str_nombre_menu, id_modulo)
    SELECT parent.id, 'Perfil', md.id
    FROM menus parent, modulos md
    WHERE parent.str_nombre_menu = 'Seguridad' AND parent.id_menu_padre = 0
      AND md.str_nombre_modulo = 'Perfil'
      AND NOT EXISTS (SELECT 1 FROM menus WHERE str_nombre_menu = 'Perfil' AND id_menu_padre = parent.id);

INSERT INTO menus (id_menu_padre, str_nombre_menu, id_modulo)
    SELECT parent.id, 'Usuario', md.id
    FROM menus parent, modulos md
    WHERE parent.str_nombre_menu = 'Seguridad' AND parent.id_menu_padre = 0
      AND md.str_nombre_modulo = 'Usuario'
      AND NOT EXISTS (SELECT 1 FROM menus WHERE str_nombre_menu = 'Usuario' AND id_menu_padre = parent.id);

INSERT INTO menus (id_menu_padre, str_nombre_menu, id_modulo)
    SELECT parent.id, 'Modulo', md.id
    FROM menus parent, modulos md
    WHERE parent.str_nombre_menu = 'Seguridad' AND parent.id_menu_padre = 0
      AND md.str_nombre_modulo = 'Modulo'
      AND NOT EXISTS (SELECT 1 FROM menus WHERE str_nombre_menu = 'Modulo' AND id_menu_padre = parent.id);

INSERT INTO menus (id_menu_padre, str_nombre_menu, id_modulo)
    SELECT parent.id, 'Permisos-Perfil', md.id
    FROM menus parent, modulos md
    WHERE parent.str_nombre_menu = 'Seguridad' AND parent.id_menu_padre = 0
      AND md.str_nombre_modulo = 'Permisos-Perfil'
      AND NOT EXISTS (SELECT 1 FROM menus WHERE str_nombre_menu = 'Permisos-Perfil' AND id_menu_padre = parent.id);

-- Submenus of Principal 1
INSERT INTO menus (id_menu_padre, str_nombre_menu, id_modulo)
    SELECT parent.id, 'Principal 1.1', md.id
    FROM menus parent, modulos md
    WHERE parent.str_nombre_menu = 'Principal 1' AND parent.id_menu_padre = 0
      AND md.str_nombre_modulo = 'Principal 1.1'
      AND NOT EXISTS (SELECT 1 FROM menus WHERE str_nombre_menu = 'Principal 1.1' AND id_menu_padre = parent.id);

INSERT INTO menus (id_menu_padre, str_nombre_menu, id_modulo)
    SELECT parent.id, 'Principal 1.2', md.id
    FROM menus parent, modulos md
    WHERE parent.str_nombre_menu = 'Principal 1' AND parent.id_menu_padre = 0
      AND md.str_nombre_modulo = 'Principal 1.2'
      AND NOT EXISTS (SELECT 1 FROM menus WHERE str_nombre_menu = 'Principal 1.2' AND id_menu_padre = parent.id);

-- Submenus of Principal 2
INSERT INTO menus (id_menu_padre, str_nombre_menu, id_modulo)
    SELECT parent.id, 'Principal 2.1', md.id
    FROM menus parent, modulos md
    WHERE parent.str_nombre_menu = 'Principal 2' AND parent.id_menu_padre = 0
      AND md.str_nombre_modulo = 'Principal 2.1'
      AND NOT EXISTS (SELECT 1 FROM menus WHERE str_nombre_menu = 'Principal 2.1' AND id_menu_padre = parent.id);

INSERT INTO menus (id_menu_padre, str_nombre_menu, id_modulo)
    SELECT parent.id, 'Principal 2.2', md.id
    FROM menus parent, modulos md
    WHERE parent.str_nombre_menu = 'Principal 2' AND parent.id_menu_padre = 0
      AND md.str_nombre_modulo = 'Principal 2.2'
      AND NOT EXISTS (SELECT 1 FROM menus WHERE str_nombre_menu = 'Principal 2.2' AND id_menu_padre = parent.id);
