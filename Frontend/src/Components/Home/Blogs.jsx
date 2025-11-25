import React, { useEffect, useState } from "react";

export default function Blogs() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 80);
  }, []);

  const posts = [
    {
      title: "How AI Is Transforming Modern Learning",
      image:
        "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg",
      excerpt:
        "AI is reshaping education with personalized learning paths and intelligent evaluation systems.",
      date: "Jan 2025",
      url: "#",
    },
    {
      title: "5 Study Techniques Backed by Research",
      image:
        "https://images.pexels.com/photos/4145153/pexels-photo-4145153.jpeg",
      excerpt:
        "Techniques proven to boost retention, focus, and productivity for students of all levels.",
      date: "Dec 2024",
      url: "#",
    },
    {
      title: "Why Online Learning Is the Future",
      image:
        "https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg",
      excerpt:
        "Digital learning is now the global standard. Discover why institutes and companies are adopting it.",
      date: "Nov 2024",
      url: "#",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">

        {/* Heading */}
        <div
          className={`text-center transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <h2 className="text-4xl font-bold text-blue-900">Latest Articles</h2>

          <p className="mt-2 text-blue-900/70 text-lg">
            Insights, trends, and learning essentials — updated weekly.
          </p>
        </div>

        {/* Blog Cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {posts.map((post, i) => (
            <article
              key={i}
              className={`
                bg-white/80 
                backdrop-blur-xl 
                rounded-3xl
                shadow-md shadow-gray-200/60
                overflow-hidden
                transition-all duration-700
                hover:shadow-xl hover:-translate-y-1
                ${
                  mounted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }
              `}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              {/* Thumbnail */}
              <div className="h-44 w-full overflow-hidden rounded-t-3xl">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-blue-900 line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-blue-900/70 text-sm mt-2 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="mt-5 flex items-center justify-between">
                  <a
                    href={post.url}
                    className="text-yellow-400 font-medium hover:underline"
                  >
                    Read More →
                  </a>

                  <span className="text-xs text-blue-900/60">
                    {post.date}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
