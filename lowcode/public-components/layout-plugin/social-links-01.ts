import { GVC } from '../../glitterBundle/GVController.js';

interface SocialLink {
  social_type: string;
  link: string;
  icon: string
}

const html = String.raw;
const css = String.raw;

export class SocialLinks01 {
  public static main(obj: { gvc: GVC; widget: any; subData: any }) {
    function scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
    const gvc = obj.gvc;
    const vm = {
      id:gvc.glitter.getUUID(),
    };

    const pageData = obj.widget.formData;
    const socialList: SocialLink[] = pageData.social_list;
    const supportSocial = ['fb', 'ig', 'line'];
    const socialIMG: Record<string, string> = {
      fb: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/5968764.png',
      ig: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/Instagram_logo_2022.png',
      line: 'https://d3jnmi1tfjgtti.cloudfront.net/file/252530754/LINE_Brand_icon.png',
      other: 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/link-solid.svg',
    };
    const gotoTopImg = 'https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/arrow-up-to-line-light.svg';
    gvc.addStyle(css`
      @media (max-width: 768px) {
        .floating-action-panel {
          position: fixed;
          bottom: 20px;
          right: 10px;
          display: flex;
          flex-direction: column; /* 垂直排列 */
          align-items: center;
          gap: 10px; /* 按鈕間距 */
          z-index: 1000;
        }
      }

      @media (min-width: 769px) {
        .floating-action-panel {
          position: fixed;
          bottom: 30px;
          right: 30px;
          display: flex;
          flex-direction: column; /* 垂直排列 */
          align-items: center;
          gap: 10px; /* 按鈕間距 */
          z-index: 1000;
        }
      }


      .social-links {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .social-link {
        color: #007bff;
        text-decoration: none;
        font-size: 14px;
      }

      .social-link:hover {
        text-decoration: underline;
      }

      .social-link:hover {
        text-decoration: underline;
      }

      .component-circle {
        background-color: transparent;
        border: none;
        padding: 2px;
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }



      .component-circle:hover {
        opacity: 0.8;
      }

      .up-to-top.hidden {
        display: none !important;
      }
    `);

    return gvc.bindView({
      bind:vm.id,
      view:()=>{
        return html`
          <div class="floating-action-panel">
            <div class="social-links">
              ${socialList
                .map(socialLink => {
                  if(socialLink.icon==='https://d3jnmi1tfjgtti.cloudfront.net/file/234285319/1722936949034-default_image.jpg'){
                    (socialLink.icon as any) = undefined;
                  }
                  const imgSrc = supportSocial.includes(socialLink.social_type)
                    ? socialIMG[socialLink.social_type]
                    : socialIMG.other;
                  return html`
                    <div onclick="${
                      gvc.event(()=>{
                        gvc.glitter.href = socialLink.link;
                      })
                    }" class="component-circle" style="overflow: hidden;
background-image: url('${socialLink.icon??imgSrc}');background-size: cover;background-position: center;"
                    >
                    </div>
                  `;
                })
                .join('')}
            </div>
            <button
              class="component-circle up-to-top hidden  rounded-circle  align-items-center justify-content-center"
              style="overflow: hidden; background-color: white;display: flex; "
              onclick="${gvc.event(() => {
                scrollToTop();
              })}"
            >
              <i class="fa-solid fa-angle-up fs-3"></i>
            </button>
          </div>
        `;
      },divCreate:{}
      ,onInitial:()=>{
        window.addEventListener('scroll', function() {
          const scrollPosition = window.scrollY;

          const threshold = window.innerHeight / 2;

          const panel = document.querySelector('.up-to-top');

          if (scrollPosition >= threshold) {
            panel!.classList.remove('hidden');
          } else {
            panel!.classList.add('hidden');
          }
        });

      }
    })

  }
}

(window as any).glitter.setModule(import.meta.url, SocialLinks01);
