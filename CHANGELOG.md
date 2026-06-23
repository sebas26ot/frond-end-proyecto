# Historial de cambios - Entrega 3

## Versión 3.0.0

### Cambios realizados
- Se agregó endpoint `/api/health` para verificar el estado del backend.
- Se agregó endpoint `/api/version` para evidenciar versión y trazabilidad.
- Se agregó mensaje visible en el frontend para identificar la Entrega 3.
- Se mejoró el archivo `docker-compose.yml` con nombres de contenedores, red y variables de entorno.
- Se agregó archivo `.dockerignore` como buena práctica de construcción de imágenes.
- Se agregó archivo `.env.example` para manejo de ambientes.
- Se agregó archivo `Jenkinsfile` para automatización con Jenkins.
- Se agregó archivo `.travis.yml` como configuración propuesta para Travis CI.

### Observaciones
- Jenkins será usado como herramienta funcional de automatización.
- Travis CI se documentará como configuración propuesta debido a restricciones de acceso.
- Codeship se documentará como herramienta no implementable actualmente por limitaciones de disponibilidad.