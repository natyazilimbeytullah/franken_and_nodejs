<template>
  <Card class="stat-card">
    <template #content>
      <div class="stat-content">
        <div class="stat-icon" :class="color">
          <i :class="icon"></i>
        </div>
        <div class="stat-details">
          <span class="stat-value">{{ formattedValue }}</span>
          <span class="stat-label">{{ label }}</span>
          <div v-if="trend !== undefined" class="stat-trend" :class="trendDirection">
            <i :class="trendDirection === 'up' ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"></i>
            <span>{{ trendDirection === 'up' ? '+' : '' }}{{ trend }}%</span>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
interface Props {
  value: number | string
  label: string
  icon: string
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red'
  trend?: number
  prefix?: string
  suffix?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'blue',
  prefix: '',
  suffix: ''
})

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    const formatted = props.value.toLocaleString('tr-TR')
    return `${props.prefix}${formatted}${props.suffix}`
  }
  return `${props.prefix}${props.value}${props.suffix}`
})

const trendDirection = computed(() => {
  if (props.trend === undefined) return null
  return props.trend >= 0 ? 'up' : 'down'
})
</script>

<style scoped>
.stat-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.stat-icon {
  width: 56px;
  height: 56px;
  min-width: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-icon.blue {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}

.stat-icon.green {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
}

.stat-icon.orange {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.stat-icon.purple {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
}

.stat-icon.red {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.stat-details {
  flex: 1;
  min-width: 0;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-label {
  display: block;
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.stat-trend {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
}

.stat-trend.up {
  background: #dcfce7;
  color: #16a34a;
}

.stat-trend.down {
  background: #fee2e2;
  color: #dc2626;
}
</style>

