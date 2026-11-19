export function Wordmark(){
  return <span className="wordmark">YAPONAMAMA<span className="wordmark-dot">.</span></span>;
}
export function Rings({className=''}:{className?:string}){
  return <svg viewBox="0 0 400 400" className={className} fill="none" aria-hidden="true">
    {Array.from({length:11},(_,i)=><circle key={i} cx="200" cy="200" r={48+i*14} stroke="currentColor"/>)}
    <path d="M200 0v400M0 200h400" stroke="currentColor" strokeDasharray="3 8"/>
  </svg>;
}
