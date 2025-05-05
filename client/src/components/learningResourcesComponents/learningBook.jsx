import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { UserAuth } from '../../context/authContext';

function BookSection() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const { user } = UserAuth();

  useEffect(() => {
    const fetchAll = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const lrRef = doc(db, 'learningResources', user.uid);
        const bookDoc = await getDoc(lrRef);
        if (bookDoc.exists()) {
          const raw = bookDoc.data().books;
          const arr =
            raw && typeof raw === 'object'
              ? Object.values(raw).map((entry) => {
                  const b = entry.book || {};
                  return {
                    id: entry.stageName || b.title,
                    volumeInfo: {
                      title: b.title,
                      authors: b.authors ? b.authors.split(', ') : [],
                      description: b.description,
                      pageCount: b.pageCount,
                      publishedDate: b.publishedDate,
                      categories: b.categories ? [b.categories] : [],
                      imageLinks: { thumbnail: b.thumbnail },
                      previewLink: b.previewLink || '',
                    },
                  };
                })
              : [];
          setBooks(arr);
        } else {
          setBooks([]);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load books.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [user]);

  const openBookDetails = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);
  const handleModalBackdropClick = (e) =>
    e.target === e.currentTarget && closeModal();

  const categories = Array.from(
    new Set(books.flatMap((b) => b.volumeInfo.categories))
  );
  const filteredBooks = activeCategory
    ? books.filter((b) => b.volumeInfo.categories.includes(activeCategory))
    : books;

  return (
    <div className="min-h-screen  text-white p-4 md:p-8">
      {loading && (
        <div className="flex justify-center items-center py-20 text-gray-400">
          Loading books...
        </div>
      )}
      {error && (
        <div className="bg-red-900/40 backdrop-blur-md border border-red-500/30 rounded-xl p-4 my-4 text-center">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-gray-800/60 backdrop-blur-md border border-blue-500/30 rounded-xl overflow-hidden shadow-lg flex flex-col"
            >
              <div className="p-4 flex flex-col h-full">
                <div className="flex mb-4">
                  <div className="w-24 h-36 flex-shrink-0 mr-4 overflow-hidden rounded-lg border border-blue-500/30 shadow-md">
                    {book.volumeInfo.imageLinks.thumbnail ? (
                      <img
                        src={book.volumeInfo.imageLinks.thumbnail}
                        alt={book.volumeInfo.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                        <span className="text-xs text-center px-2">
                          No Cover
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold line-clamp-2 mb-1">
                      {book.volumeInfo.title}
                    </h3>
                    <p className="text-sm text-gray-300 mb-2">
                      {book.volumeInfo.authors.join(', ')}
                    </p>
                    {book.volumeInfo.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300">
                          {book.volumeInfo.categories[0]}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-auto">
                  {book.volumeInfo.description && (
                    <p className="text-sm text-gray-300 line-clamp-3">
                      {book.volumeInfo.description}
                    </p>
                  )}
                  {book.volumeInfo.description && (
                    <button
                      onClick={() => openBookDetails(book)}
                      className="mt-2 text-xs text-blue-400 hover:text-blue-300 flex items-center"
                    >
                      Show more
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="mt-4 pt-3 border-t border-blue-500/20 flex justify-between items-center">
                  <div className="text-xs text-gray-400">
                    {book.volumeInfo.publishedDate && (
                      <span>
                        {book.volumeInfo.publishedDate.substring(0, 4)}
                      </span>
                    )}
                    {book.volumeInfo.pageCount && (
                      <span className="ml-2">
                        {book.volumeInfo.pageCount} pages
                      </span>
                    )}
                  </div>
                  <a
                    href={book.volumeInfo.previewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-colors duration-300"
                  >
                    View on Google Books
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && selectedBook && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleModalBackdropClick}
        >
          <div className="bg-gray-800/90 backdrop-blur-md border border-blue-500/30 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-xl">
            <div className="flex justify-between items-start p-4 border-b border-blue-500/30">
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                Book Details
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
              <div className="flex flex-col sm:flex-row gap-6 mb-6">
                <div className="w-32 h-48 sm:w-40 sm:h-60 overflow-hidden rounded-lg border border-blue-500/30 shadow-md">
                  {selectedBook.volumeInfo.imageLinks.thumbnail ? (
                    <img
                      src={selectedBook.volumeInfo.imageLinks.thumbnail}
                      alt={selectedBook.volumeInfo.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                      <span>No Cover</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">
                    {selectedBook.volumeInfo.title}
                  </h2>
                  <p className="text-gray-300 mb-4">
                    {selectedBook.volumeInfo.authors.join(', ')}
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {selectedBook.volumeInfo.publishedDate && (
                      <div>
                        <span className="text-xs text-gray-400">Published</span>
                        <p className="text-sm">
                          {selectedBook.volumeInfo.publishedDate}
                        </p>
                      </div>
                    )}
                    {selectedBook.volumeInfo.pageCount && (
                      <div>
                        <span className="text-xs text-gray-400">Pages</span>
                        <p className="text-sm">
                          {selectedBook.volumeInfo.pageCount}
                        </p>
                      </div>
                    )}
                  </div>
                  {selectedBook.volumeInfo.categories.length > 0 && (
                    <div className="mb-4">
                      <span className="text-xs text-gray-400 block mb-1">
                        Categories
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {selectedBook.volumeInfo.categories.map((c, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2 text-blue-300">
                  Description
                </h4>
                <p className="text-gray-300 whitespace-pre-line">
                  {selectedBook.volumeInfo.description}
                </p>
              </div>
            </div>
            <div className="border-t border-blue-500/30 p-4 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg border border-blue-500/30 text-blue-400"
              >
                Close
              </button>
              <a
                href={selectedBook.volumeInfo.previewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-colors"
              >
                View on Google Books
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookSection;
