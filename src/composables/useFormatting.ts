/**
 * Composable for date and status formatting utilities
 */
export function useFormatting() {
  /**
   * Format date to readable string
   */
  const formatDate = (dateString: string | Date) => {
    if (!dateString) return 'No date'
    
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  /**
   * Format date to long format
   */
  const formatDateLong = (dateString: string | Date) => {
    if (!dateString) return 'No date'
    
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  /**
   * Format time
   */
  const formatTime = (timeString: string | Date) => {
    if (!timeString) return ''
    
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  /**
   * Format date and time together
   */
  const formatDateTime = (dateTimeString: string | Date) => {
    if (!dateTimeString) return ''
    
    // Handle TimeOnly format (HH:mm:ss)
    if (typeof dateTimeString === 'string' && /^\d{2}:\d{2}:\d{2}/.test(dateTimeString)) {
      const [hours, minutes] = dateTimeString.split(':')
      const hour = parseInt(hours)
      const min = parseInt(minutes)
      const period = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour % 12 || 12
      return `${displayHour}:${min.toString().padStart(2, '0')} ${period}`
    }
    
    return new Date(dateTimeString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  /**
   * Get status badge class
   */
  const getStatusClass = (status: string) => {
    const normalizedStatus = status.toLowerCase()
    
    const statusMap: Record<string, string> = {
      'scheduled': 'upcoming',
      'upcoming': 'upcoming',
      'inprogress': 'active',
      'in progress': 'active',
      'completed': 'completed',
      'cancelled': 'cancelled'
    }
    
    return statusMap[normalizedStatus] || 'upcoming'
  }

  /**
   * Format game status to display text
   */
  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      'scheduled': 'Scheduled',
      'inprogress': 'In Progress',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    }
    
    return statusMap[status.toLowerCase()] || status
  }

  return {
    formatDate,
    formatDateLong,
    formatTime,
    formatDateTime,
    getStatusClass,
    formatStatus
  }
}
