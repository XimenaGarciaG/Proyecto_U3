-- Initial Data Implementation
-- Perfiles
INSERT INTO perfiles (str_nombre_perfil, bit_administrador) VALUES ('Administrador', true);
INSERT INTO perfiles (str_nombre_perfil, bit_administrador) VALUES ('Usuario', false);

-- Modulos
INSERT INTO modulos (str_nombre_modulo) VALUES ('Perfil');
INSERT INTO modulos (str_nombre_modulo) VALUES ('Usuario');
INSERT INTO modulos (str_nombre_modulo) VALUES ('Modulo');
INSERT INTO modulos (str_nombre_modulo) VALUES ('Permisos-Perfil');
INSERT INTO modulos (str_nombre_modulo) VALUES ('Principal 1.1');
INSERT INTO modulos (str_nombre_modulo) VALUES ('Principal 1.2');
INSERT INTO modulos (str_nombre_modulo) VALUES ('Principal 2.1');
INSERT INTO modulos (str_nombre_modulo) VALUES ('Principal 2.2');

-- Permisos for Admin (id=1) 
-- (Assuming IDs 1-8 for modulos above)
INSERT INTO permisos_perfil (id_modulo, id_perfil, bit_agregar, bit_editar, bit_consulta, bit_eliminar, bit_detalle) VALUES (1, 1, true, true, true, true, true);
INSERT INTO permisos_perfil (id_modulo, id_perfil, bit_agregar, bit_editar, bit_consulta, bit_eliminar, bit_detalle) VALUES (2, 1, true, true, true, true, true);
INSERT INTO permisos_perfil (id_modulo, id_perfil, bit_agregar, bit_editar, bit_consulta, bit_eliminar, bit_detalle) VALUES (3, 1, true, true, true, true, true);
INSERT INTO permisos_perfil (id_modulo, id_perfil, bit_agregar, bit_editar, bit_consulta, bit_eliminar, bit_detalle) VALUES (4, 1, true, true, true, true, true);
INSERT INTO permisos_perfil (id_modulo, id_perfil, bit_agregar, bit_editar, bit_consulta, bit_eliminar, bit_detalle) VALUES (5, 1, true, true, true, true, true);
INSERT INTO permisos_perfil (id_modulo, id_perfil, bit_agregar, bit_editar, bit_consulta, bit_eliminar, bit_detalle) VALUES (6, 1, true, true, true, true, true);
INSERT INTO permisos_perfil (id_modulo, id_perfil, bit_agregar, bit_editar, bit_consulta, bit_eliminar, bit_detalle) VALUES (7, 1, true, true, true, true, true);
INSERT INTO permisos_perfil (id_modulo, id_perfil, bit_agregar, bit_editar, bit_consulta, bit_eliminar, bit_detalle) VALUES (8, 1, true, true, true, true, true);

-- Menus
-- Parents (id 1, 2, 3)
INSERT INTO menus (id_menu_padre, str_nombre_menu, id_modulo) VALUES (0, 'Seguridad', NULL);
INSERT INTO menus (id_menu_padre, str_nombre_menu, id_modulo) VALUES (0, 'Principal 1', NULL);
INSERT INTO menus (id_menu_padre, str_nombre_menu, id_modulo) VALUES (0, 'Principal 2', NULL);

-- Submenus (Seguridad) - Assuming Parent Seguridad is ID 1
INSERT INTO menus (id_menu_padre, str_nombre_menu, id_modulo) VALUES (1, 'Perfil', 1);
INSERT INTO menus (id_menu_padre, str_nombre_menu, id_modulo) VALUES (1, 'Usuario', 2);
INSERT INTO menus (id_menu_padre, str_nombre_menu, id_modulo) VALUES (1, 'Modulo', 3);
INSERT INTO menus (id_menu_padre, str_nombre_menu, id_modulo) VALUES (1, 'Permisos-Perfil', 4);

-- Submenus (Principal 1) - Assuming Parent Principal 1 is ID 2
INSERT INTO menus (id_menu_padre, str_nombre_menu, id_modulo) VALUES (2, 'Principal 1.1', 5);
INSERT INTO menus (id_menu_padre, str_nombre_menu, id_modulo) VALUES (2, 'Principal 1.2', 6);

-- Submenus (Principal 2) - Assuming Parent Principal 2 is ID 3
INSERT INTO menus (id_menu_padre, str_nombre_menu, id_modulo) VALUES (3, 'Principal 2.1', 7);
INSERT INTO menus (id_menu_padre, str_nombre_menu, id_modulo) VALUES (3, 'Principal 2.2', 8);

