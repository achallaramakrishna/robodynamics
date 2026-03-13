# Production Scripts

Use this folder for the scripts that are still useful for pushing builds to production.

Files:
- `deploy_prod.ps1`: local PowerShell entry point that uploads the WAR and rotates Tomcat on prod.
- `war_deploy_remote.sh`: remote WAR deploy script for standard Tomcat rotation.
- `war_deploy_force.sh`: force-copy WAR deploy variant.
- `ai_tutor_web_build_restart_remote.sh`: rebuilds and restarts the AI Tutor web app on the server.
- `ai_tutor_lms_push_remote.sh`: larger AI Tutor LMS production push script.
- `content_radar_prod_deploy_remote.sh`: Content Radar production deploy script.

Archived one-off and temporary root scripts were moved to `scripts/archive/root-temp-2026-03-09/`.
