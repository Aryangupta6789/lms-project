import app from './server.js'
const PORT = process.env.PORT || 5000
// Only listen if NOT running on Vercel
if (process.env.VAMPIRE_VARIABLE !== 'true') { // Just check an env var or if require.main
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
}
export default app