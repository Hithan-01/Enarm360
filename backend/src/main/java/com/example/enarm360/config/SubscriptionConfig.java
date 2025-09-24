package com.example.enarm360.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.math.BigDecimal;

@Configuration
@EnableScheduling
@EnableAsync
@ConfigurationProperties(prefix = "app.subscription")
public class SubscriptionConfig {
    
    // Configuración general
    private String timezone = "America/Monterrey";
    private String defaultCurrency = "USD";
    
    // Configuración de métricas
    private boolean metricsEnabled = true;
    
    // Configuración de tareas automáticas
    private boolean autoExpireEnabled = true;
    private String autoExpireCron = "0 0 1 * * ?";
    private String metricsCron = "0 0 2 * * ?";
    
    // Configuración de notificaciones
    private boolean notificationsEnabled = true;
    private int expireWarningDays = 7;
    private int renewalReminderDays = 3;
    
    // Límites de intentos
    private MaxAttempts maxAttempts = new MaxAttempts();
    
    // Precios por defecto
    private DefaultPrices defaultPrices = new DefaultPrices();
    
    // Configuración de cupones
    private CouponSettings couponSettings = new CouponSettings();
    
    // Configuración de pagos
    private PaymentSettings paymentSettings = new PaymentSettings();
    
    // Clases anidadas
    public static class MaxAttempts {
        private int free = 10;
        private int trial = 50;
        private int standard = -1;
        private int premium = -1;
        
        // Getters y setters
        public int getFree() { return free; }
        public void setFree(int free) { this.free = free; }
        
        public int getTrial() { return trial; }
        public void setTrial(int trial) { this.trial = trial; }
        
        public int getStandard() { return standard; }
        public void setStandard(int standard) { this.standard = standard; }
        
        public int getPremium() { return premium; }
        public void setPremium(int premium) { this.premium = premium; }
    }
    
    public static class DefaultPrices {
        private BigDecimal standardMonthlyPrice = new BigDecimal("29.99");
        private BigDecimal standardYearlyPrice = new BigDecimal("299.99");
        private BigDecimal premiumMonthlyPrice = new BigDecimal("49.99");
        private BigDecimal premiumYearlyPrice = new BigDecimal("499.99");
        
        // Getters y setters
        public BigDecimal getStandardMonthlyPrice() { return standardMonthlyPrice; }
        public void setStandardMonthlyPrice(BigDecimal standardMonthlyPrice) { this.standardMonthlyPrice = standardMonthlyPrice; }
        
        public BigDecimal getStandardYearlyPrice() { return standardYearlyPrice; }
        public void setStandardYearlyPrice(BigDecimal standardYearlyPrice) { this.standardYearlyPrice = standardYearlyPrice; }
        
        public BigDecimal getPremiumMonthlyPrice() { return premiumMonthlyPrice; }
        public void setPremiumMonthlyPrice(BigDecimal premiumMonthlyPrice) { this.premiumMonthlyPrice = premiumMonthlyPrice; }
        
        public BigDecimal getPremiumYearlyPrice() { return premiumYearlyPrice; }
        public void setPremiumYearlyPrice(BigDecimal premiumYearlyPrice) { this.premiumYearlyPrice = premiumYearlyPrice; }
    }
    
    public static class CouponSettings {
        private boolean enabled = true;
        private int defaultValidityDays = 30;
        private int maxUsageLimit = 1000;
        private BigDecimal maxDiscountPercentage = new BigDecimal("50");
        
        // Getters y setters
        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }
        
        public int getDefaultValidityDays() { return defaultValidityDays; }
        public void setDefaultValidityDays(int defaultValidityDays) { this.defaultValidityDays = defaultValidityDays; }
        
        public int getMaxUsageLimit() { return maxUsageLimit; }
        public void setMaxUsageLimit(int maxUsageLimit) { this.maxUsageLimit = maxUsageLimit; }
        
        public BigDecimal getMaxDiscountPercentage() { return maxDiscountPercentage; }
        public void setMaxDiscountPercentage(BigDecimal maxDiscountPercentage) { this.maxDiscountPercentage = maxDiscountPercentage; }
    }
    
    public static class PaymentSettings {
        private boolean enabled = true;
        private String defaultPaymentMethod = "STRIPE";
        private String[] acceptedCurrencies = {"USD", "MXN", "EUR"};
        
        // Getters y setters
        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }
        
        public String getDefaultPaymentMethod() { return defaultPaymentMethod; }
        public void setDefaultPaymentMethod(String defaultPaymentMethod) { this.defaultPaymentMethod = defaultPaymentMethod; }
        
        public String[] getAcceptedCurrencies() { return acceptedCurrencies; }
        public void setAcceptedCurrencies(String[] acceptedCurrencies) { this.acceptedCurrencies = acceptedCurrencies; }
    }
    
    // Getters y setters principales
    public String getTimezone() { return timezone; }
    public void setTimezone(String timezone) { this.timezone = timezone; }
    
    public String getDefaultCurrency() { return defaultCurrency; }
    public void setDefaultCurrency(String defaultCurrency) { this.defaultCurrency = defaultCurrency; }
    
    public boolean isMetricsEnabled() { return metricsEnabled; }
    public void setMetricsEnabled(boolean metricsEnabled) { this.metricsEnabled = metricsEnabled; }
    
    public boolean isAutoExpireEnabled() { return autoExpireEnabled; }
    public void setAutoExpireEnabled(boolean autoExpireEnabled) { this.autoExpireEnabled = autoExpireEnabled; }
    
    public String getAutoExpireCron() { return autoExpireCron; }
    public void setAutoExpireCron(String autoExpireCron) { this.autoExpireCron = autoExpireCron; }
    
    public String getMetricsCron() { return metricsCron; }
    public void setMetricsCron(String metricsCron) { this.metricsCron = metricsCron; }
    
    public boolean isNotificationsEnabled() { return notificationsEnabled; }
    public void setNotificationsEnabled(boolean notificationsEnabled) { this.notificationsEnabled = notificationsEnabled; }
    
    public int getExpireWarningDays() { return expireWarningDays; }
    public void setExpireWarningDays(int expireWarningDays) { this.expireWarningDays = expireWarningDays; }
    
    public int getRenewalReminderDays() { return renewalReminderDays; }
    public void setRenewalReminderDays(int renewalReminderDays) { this.renewalReminderDays = renewalReminderDays; }
    
    public MaxAttempts getMaxAttempts() { return maxAttempts; }
    public void setMaxAttempts(MaxAttempts maxAttempts) { this.maxAttempts = maxAttempts; }
    
    public DefaultPrices getDefaultPrices() { return defaultPrices; }
    public void setDefaultPrices(DefaultPrices defaultPrices) { this.defaultPrices = defaultPrices; }
    
    public CouponSettings getCouponSettings() { return couponSettings; }
    public void setCouponSettings(CouponSettings couponSettings) { this.couponSettings = couponSettings; }
    
    public PaymentSettings getPaymentSettings() { return paymentSettings; }
    public void setPaymentSettings(PaymentSettings paymentSettings) { this.paymentSettings = paymentSettings; }
}