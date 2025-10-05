// public/js/feed.js
document.addEventListener("DOMContentLoaded", () => {

  // THREE DOTS MENU
  document.querySelectorAll('.three-dots-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const menu = this.nextElementSibling;
      document.querySelectorAll('.three-dots-menu').forEach(m => { 
        if (m !== menu) m.classList.add('hidden'); 
      });
      menu.classList.toggle('hidden');
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.three-dots-menu').forEach(m => m.classList.add('hidden'));
  });

  // EDIT POST
  document.querySelectorAll('.edit-post-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const postId = this.dataset.id;
      const editForm = document.getElementById(`edit-form-${postId}`);
      document.querySelectorAll('[id^="edit-form-"]').forEach(f => { 
        if (f.id !== `edit-form-${postId}`) f.classList.add('hidden'); 
      });
      editForm.classList.remove('hidden');
    });
  });

  // CANCEL EDIT
  document.querySelectorAll('.cancel-edit').forEach(btn => {
    btn.addEventListener('click', function() {
      const postId = this.dataset.id;
      document.getElementById(`edit-form-${postId}`).classList.add('hidden');
    });
  });

  // MULTIPLE MEDIA PREVIEW WITH REMOVE OPTION
  const mediaInput = document.getElementById('mediaInput');
  const mediaPreview = document.getElementById('mediaPreview');

  if (mediaInput) {
    mediaInput.addEventListener('change', function() {
      const files = Array.from(this.files);
      console.log('Files selected:', files.length);

      // Clear previews first
      // (optional) keep existing preview behavior; here we append
      files.forEach(file => {
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) return;

        const reader = new FileReader();
        reader.onload = function(e) {
          const previewItem = document.createElement('div');
          previewItem.className = 'relative group';
          previewItem.dataset.filename = file.name;

          if (file.type.startsWith('video')) {
            previewItem.innerHTML = `
              <video class="w-full h-24 object-cover rounded-lg" controls>
                <source src="${e.target.result}" type="${file.type}">
              </video>
              <button type="button" class="remove-media absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                ×
              </button>
            `;
          } else {
            previewItem.innerHTML = `
              <img src="${e.target.result}" class="w-full h-24 object-cover rounded-lg" alt="Preview">
              <button type="button" class="remove-media absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                ×
              </button>
            `;
          }

          mediaPreview.appendChild(previewItem);

          // Remove media functionality
          previewItem.querySelector('.remove-media').addEventListener('click', function() {
            previewItem.remove();
            // Create new FileList without the removed file
            const dt = new DataTransfer();
            const remainingFiles = Array.from(mediaInput.files).filter(f => f.name !== file.name);
            remainingFiles.forEach(f => dt.items.add(f));
            mediaInput.files = dt.files;
          });
        };
        reader.readAsDataURL(file);
      });
    });
  }

  // CAROUSEL FUNCTIONALITY
  document.addEventListener('click', function(e) {
    // Carousel navigation
    if (e.target.closest('.carousel-prev') || e.target.closest('.carousel-next')) {
      const carousel = e.target.closest('.carousel');
      const items = carousel.querySelectorAll('.carousel-item');
      const indicators = carousel.querySelectorAll('.carousel-indicator');
      const currentIndex = Array.from(items).findIndex(item => item.classList.contains('opacity-100'));

      let newIndex;
      if (e.target.closest('.carousel-next')) {
        newIndex = (currentIndex + 1) % items.length;
      } else {
        newIndex = (currentIndex - 1 + items.length) % items.length;
      }

      // Update visibility
      items.forEach((item, index) => {
        item.classList.toggle('opacity-100', index === newIndex);
        item.classList.toggle('opacity-0', index !== newIndex);
      });

      // Update indicators
      indicators.forEach((indicator, index) => {
        indicator.classList.toggle('bg-opacity-100', index === newIndex);
        indicator.classList.toggle('bg-opacity-50', index !== newIndex);
      });
    }

    // Carousel indicator click
    if (e.target.classList.contains('carousel-indicator')) {
      const carousel = e.target.closest('.carousel');
      const items = carousel.querySelectorAll('.carousel-item');
      const indicators = carousel.querySelectorAll('.carousel-indicator');
      const newIndex = parseInt(e.target.dataset.index);

      items.forEach((item, index) => {
        item.classList.toggle('opacity-100', index === newIndex);
        item.classList.toggle('opacity-0', index !== newIndex);
      });

      indicators.forEach((indicator, index) => {
        indicator.classList.toggle('bg-opacity-100', index === newIndex);
        indicator.classList.toggle('bg-opacity-50', index !== newIndex);
      });
    }
  });

  // LIKE FUNCTIONALITY
  document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', async function() {
      const postId = this.dataset.id;
      const countSpan = this.querySelector('.like-count');
      const icon = this.querySelector('.material-icons');

      try {
        const res = await fetch(`/like/${postId}`, { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await res.json();

        if (data.likes !== undefined) {
          countSpan.textContent = data.likes;
          // Add visual feedback
          this.classList.add('text-blue-600');
          icon.textContent = 'thumb_up';
        }
      } catch (err) { 
        console.error('Like error:', err); 
      }
    });
  });

  // SHARE FUNCTIONALITY
  document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', async function() {
      const postId = this.dataset.id;
      const countSpan = this.querySelector('.share-count');

      try {
        const res = await fetch(`/share/${postId}`, { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await res.json();

        if (data.success) {
          countSpan.textContent = data.shares;

          // Create shareable URL
          const shareUrl = window.location.origin;
          const shareText = 'Check out this post!';

          // Web Share API if available
          if (navigator.share) {
            navigator.share({
              title: 'Social Feed',
              text: shareText,
              url: shareUrl
            });
          } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareUrl).then(() => {
              alert('Link copied to clipboard!');
            });
          }
        }
      } catch (err) { 
        console.error('Share error:', err); 
      }
    });
  });

  // STORY UPLOAD
  const storyInput = document.getElementById('storyInput');
  if (storyInput) {
    storyInput.addEventListener('change', function() {
      if (this.files.length > 0) {
        document.getElementById('storyForm').submit();
      }
    });
  }
});
