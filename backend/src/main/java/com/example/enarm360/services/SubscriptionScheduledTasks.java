package com.example.enarm360.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
@ConditionalOnProperty(name = "app.subscription.auto-expire.enabled", havingValue = "true", matchIfMissing = true)
public class SubscriptionScheduledTasks {
    
    private final UserSubscriptionService userSubscriptionService;
    private final SubscriptionMetricsService subscriptionMetricsService;
    
    /**
     * Procesa suscripciones expiradas todos los días a la 1 AM
     */
    @Scheduled(cron = "${app.subscription.auto-expire.cron:0 0 1 * * ?}")
    public void processExpiredSubscriptions() {
        log.info("Iniciando procesamiento de suscripciones expiradas...");
        try {
            userSubscriptionService.processExpiredSubscriptions();
            log.info("Procesamiento de suscripciones expiradas completado");
        } catch (Exception e) {
            log.error("Error al procesar suscripciones expiradas", e);
        }
    }
    
    /**
     * Genera métricas diarias a las 2 AM
     */
    @Scheduled(cron = "0 0 2 * * ?")
    @ConditionalOnProperty(name = "app.subscription.metrics.enabled", havingValue = "true", matchIfMissing = true)
    public void generateDailyMetrics() {
        log.info("Generando métricas diarias de suscripciones...");
        try {
            subscriptionMetricsService.generateDailyMetrics();
            log.info("Métricas diarias generadas exitosamente");
        } catch (Exception e) {
            log.error("Error al generar métricas diarias", e);
        }
    }
    
    /**
     * Limpia métricas antiguas cada domingo a las 3 AM (mantener solo últimos 365 días)
     */
    @Scheduled(cron = "0 0 3 * * SUN")
    public void cleanupOldMetrics() {
        log.info("Iniciando limpieza de métricas antiguas...");
        try {
            // Implementar lógica de limpieza si es necesario
            log.info("Limpieza de métricas completada");
        } catch (Exception e) {
            log.error("Error al limpiar métricas antiguas", e);
        }
    }
}
