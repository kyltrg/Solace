export default function TonightPreview():
React.JSX.Element {

return (

<section
id="tonight"
className="
relative
flex
min-h-[85vh]
items-center
justify-center
overflow-hidden
px-6
bg-[var(--bg-elevated)]
"
>


<div
className="
absolute
inset-0
bg-gradient-to-b
from-[var(--bg)]
via-transparent
to-[var(--bg)]
"
/>



<div
className="
relative
z-10
max-w-3xl
text-center
"
>


<p
className="
text-xs
uppercase
tracking-[0.4em]
text-[var(--accent)]
"
>
Tonight
</p>



<h2
className="
mt-8
font-display
text-4xl
sm:text-6xl
font-light
leading-tight
md:text-8xl
"
>
Before we sleep...
</h2>



<p
className="
mx-auto
mt-8
max-w-xl
leading-relaxed
text-[var(--muted)]
"
>
A quiet little space before the day ends.
Write what you felt, what you prayed for,
or simply keep a piece of today.
</p>



<a
href="/tonight"
className="
mt-12
inline-flex
rounded-full
border
border-[var(--accent)]/40
px-8
py-3
text-[var(--text)]
transition-all
hover:bg-[var(--accent)]/10
"
>
Open Tonight
</a>


</div>


</section>

);

}
