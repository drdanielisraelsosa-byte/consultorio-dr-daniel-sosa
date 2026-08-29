# Correo transaccional con Gmail

Este módulo permite que la agenda envíe dos mensajes desde `drdanielisraelsosa@gmail.com`: uno al paciente y otro a la bandeja del doctor.

1. Crea un proyecto en Google Apps Script y pega `Code.gs`.
2. En **Configuración del proyecto > Propiedades de la secuencia de comandos**, crea `AGENDA_WEBHOOK_SECRET` con un valor largo y aleatorio.
3. Implementa como aplicación web: ejecutar como el propietario y permitir acceso a cualquiera.
4. Guarda en Sites `GMAIL_WEBHOOK_URL` con la URL de implementación y `GMAIL_WEBHOOK_SECRET` con el mismo secreto.

La agenda detecta estas variables automáticamente. Si no existen, conserva el proveedor de correo anterior como respaldo.
