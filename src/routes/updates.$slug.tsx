import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { PostCard, formatDate } from '@/components/Cards'
import { EnquiryForm } from '@/components/EnquiryForm'
import { getPublicContent } from '@/lib/public-functions'

export const Route = createFileRoute('/updates/$slug')({
  loader: async ({ params }) => {
    const { posts } = await getPublicContent()
    const post = posts.find((p) => p.slug === params.slug)
    if (!post) throw notFound()
    return { post, posts }
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.post.title} · British Education and Immigration` }, { name: 'description', content: loaderData?.post.excerpt }],
  }),
  component: PostPage,
})

function PostPage() {
  const { post, posts } = Route.useLoaderData()
  const more = posts.filter((p) => p.slug !== post.slug).slice(0, 3)
  return (
    <>
      <article className="mx-auto max-w-3xl px-6 pt-16 pb-12">
        <Link to="/updates" className="text-sm font-bold text-coral-600">
          ← All updates
        </Link>
        <div className="mt-8 flex items-center gap-3 text-sm">
          <span className="rounded-full bg-forest-50 px-3 py-1 font-bold text-forest-700">{post.category}</span>
          <span className="font-mono text-forest-900/50">
            {formatDate(post.date)} · {post.readMins} min read{post.lastReviewed ? ` · Last reviewed ${formatDate(post.lastReviewed)}` : ''}
          </span>
        </div>
        <h1 className="mt-6 text-4xl font-extrabold leading-tight text-forest-900 md:text-5xl">{post.title}</h1>
        <p className="mt-6 text-xl text-forest-900/70">{post.excerpt}</p>
        <div className="mt-10 space-y-6 border-t border-forest-900/10 pt-10 text-lg leading-relaxed text-forest-900/85">
          {post.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        {post.sources?.length ? (
          <div className="mt-8 border-t border-forest-900/10 pt-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-forest-900/55">Official sources</h2>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              {post.sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noreferrer" className="text-sm font-bold text-coral-600 hover:underline">
                    {source.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="mt-14 rounded-[2rem] bg-forest-900 bg-grain p-8 text-white">
          <h2 className="text-2xl font-extrabold">Have a question about this update?</h2>
          <p className="mt-1 mb-6 text-forest-100/70">Ask our counsellor — free.</p>
          <EnquiryForm source={`blog-${post.slug}`} dark compact />
        </div>
      </article>
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <h2 className="mb-8 text-3xl font-extrabold text-forest-900">More updates</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {more.map((p) => (
            <PostCard key={p.slug} p={p} />
          ))}
        </div>
      </section>
    </>
  )
}
