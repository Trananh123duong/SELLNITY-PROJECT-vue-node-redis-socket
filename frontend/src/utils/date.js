export const formatMessageTime = (value) => {
  if (!value) {
    return ''
  }

  const messageDate = new Date(value)

  if (Number.isNaN(messageDate.getTime())) {
    return ''
  }

  const now = new Date()
  const isSameDay =
    messageDate.getDate() === now.getDate() &&
    messageDate.getMonth() === now.getMonth() &&
    messageDate.getFullYear() === now.getFullYear()

  if (isSameDay) {
    return messageDate.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return messageDate.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
