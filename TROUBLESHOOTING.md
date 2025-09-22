# Troubleshooting Guide

## Common Issues and Solutions

### 1. SSL/HTTPS Error on Reload

**Error:** `ERR_SSL_PROTOCOL_ERROR` or "This site can't provide a secure connection"

**Solution:**
- Make sure you're accessing `http://localhost:3001` (NOT `https://`)
- Clear your browser cache and cookies for localhost
- Try opening in an incognito/private window
- If browser redirects to HTTPS, manually type `http://localhost:3001`

**Steps:**
1. Stop the dev server (Ctrl+C)
2. Clear browser cache: `Ctrl+Shift+Delete` (Chrome/Edge) or `Cmd+Shift+Delete` (Safari)
3. Restart: `npm run dev`
4. Open: `http://localhost:3001` (not https)

### 2. Port Already in Use

**Error:** `Port 3001 is already in use`

**Solution:**
```bash
# Kill process on port 3001
npx kill-port 3001

# Or use a different port
npm run dev -- --port 3002
```

### 3. Tasks Not Saving

**Issue:** Tasks disappear after page reload

**Solution:** 
- Make sure localStorage is enabled in your browser
- Check browser console for errors
- Try in incognito mode to test without extensions

### 4. Drag and Drop Not Working

**Issue:** Can't drag tasks between columns

**Solution:**
- Make sure you're clicking and dragging the task card itself
- Try refreshing the page
- Check browser console for JavaScript errors

### 5. Login Issues

**Issue:** Can't login or logout

**Solution:**
- Clear browser localStorage: `F12 > Application > Storage > Clear storage`
- Try in incognito mode
- Restart the development server

### 6. Styling Issues

**Issue:** Page looks broken or unstyled

**Solution:**
- Make sure TailwindCSS is properly installed: `npm install`
- Restart the dev server
- Clear browser cache

### 7. API Connection Issues

**Issue:** Getting network errors when creating/editing tasks

**Solution:**
- This is normal for the demo version using mock data
- Check browser console - errors are expected without a backend
- The app should still work with localStorage persistence

## Browser Compatibility

**Supported Browsers:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Recommended:** Chrome or Firefox for best experience

## Development Tips

1. **Always use HTTP:** `http://localhost:3001` (not HTTPS)
2. **Clear cache regularly** during development
3. **Use incognito mode** to test without extensions
4. **Check browser console** (F12) for any errors
5. **Restart dev server** if issues persist

## Still Having Issues?

1. Try the reset script:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   ```

2. Check the browser console (F12) for specific error messages

3. Make sure you're using Node.js 18+ and npm 8+
