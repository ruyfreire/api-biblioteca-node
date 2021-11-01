import axios from 'axios'

export const getEmojisGithub = async () => {
  try {
    const response = await axios.get('https://api.github.com/emojis')

    return response.data
  } catch (error) {
    return error
  }
}
