export class GetStart {
    constructor(gvc) {
        this.samplePage = () => {
            return `
                <!-- Page container -->

                <div class="container-fluid px-xxl-5 px-lg-4 pt-4 pt-lg-5 pb-2 pb-lg-4" style="white-space: nowrap;word-break: break-all;">
                    <!-- Page title -->
                    <div class="d-sm-flex align-items-end justify-content-between ps-lg-2 ps-xxl-0 mt-2 mt-lg-0 pt-4 mb-n3">
                        <div class="me-4">
                            <h1 class="pb-1">Typography</h1>
                            <p class="text-muted fs-lg mb-2">Headings, body text, lists, blockquotes and more.</p>
                        </div>
                        <a
                            href="https://getbootstrap.com/docs/5.1/content/typography/"
                            class="btn btn-link px-0"
                            target="_blank"
                            rel="noopener"
                        >
                            Bootstrap docs
                            <i class="bx bx-link-external fs-lg ms-2"></i>
                        </a>
                    </div>

                    <!-- Headings -->
                    <section id="type-headings" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                        <h2 class="h4">Headings</h2>
                        <div class="d-table">
                            <ul class="nav nav-tabs-alt" role="tablist">
                                <li class="nav-item">
                                    <a
                                        class="nav-link active"
                                        href="#preview1"
                                        data-bs-toggle="tab"
                                        role="tab"
                                        aria-controls="preview1"
                                        aria-selected="true"
                                    >
                                        <i class="bx bx-show-alt fs-base opacity-70 me-2"></i>
                                        Preview
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a
                                        class="nav-link"
                                        href="#html1"
                                        data-bs-toggle="tab"
                                        role="tab"
                                        aria-controls="html1"
                                        aria-selected="false"
                                    >
                                        <i class="bx bx-code-alt fs-base opacity-70 me-2"></i>
                                        HTML
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div class="tab-content pt-1">
                            <div class="tab-pane fade show active" id="preview1" role="tabpanel">
                                <h1>h1. Silicon heading</h1>
                                <hr class="my-0" />
                                <h2 class="pt-3">h2. Silicon heading</h2>
                                <hr class="my-0" />
                                <h3 class="pt-3">h3. Silicon heading</h3>
                                <hr class="my-0" />
                                <h4 class="pt-3">h4. Silicon heading</h4>
                                <hr class="my-0" />
                                <h5 class="pt-3">h5. Silicon heading</h5>
                                <hr class="my-0" />
                                <h6 class="pt-3 mb-0">h6. Silicon heading</h6>
                            </div>
                            <div class="tab-pane fade" id="html1" role="tabpanel">
                                <pre class="line-numbers"><code class="lang-html">&lt;!-- Headings --&gt;
&lt;h1&gt;h1. Createx heading&lt;/h1&gt;
&lt;h2&gt;h2. Createx heading&lt;/h2&gt;
&lt;h3&gt;h3. Createx heading&lt;/h3&gt;
&lt;h4&gt;h4. Createx heading&lt;/h4&gt;
&lt;h5&gt;h5. Createx heading&lt;/h5&gt;
&lt;h6&gt;h6. Createx heading&lt;/h6&gt;</code></pre>
                            </div>
                        </div>
                    </section>

                    <!-- Display headings -->
                    <section id="type-displays" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                        <h2 class="h4">Display headings</h2>
                        <div class="d-table">
                            <ul class="nav nav-tabs-alt" role="tablist">
                                <li class="nav-item">
                                    <a
                                        class="nav-link active"
                                        href="#preview2"
                                        data-bs-toggle="tab"
                                        role="tab"
                                        aria-controls="preview2"
                                        aria-selected="true"
                                    >
                                        <i class="bx bx-show-alt fs-base opacity-70 me-2"></i>
                                        Preview
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a
                                        class="nav-link"
                                        href="#html2"
                                        data-bs-toggle="tab"
                                        role="tab"
                                        aria-controls="html2"
                                        aria-selected="false"
                                    >
                                        <i class="bx bx-code-alt fs-base opacity-70 me-2"></i>
                                        HTML
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div class="tab-content pt-1">
                            <div class="tab-pane fade show active" id="preview2" role="tabpanel">
                                <h1 class="display-1">Display 1</h1>
                                <hr class="my-0" />
                                <h1 class="display-2 pt-3">Display 2</h1>
                                <hr class="my-0" />
                                <h1 class="display-3 pt-3">Display 3</h1>
                                <hr class="my-0" />
                                <h1 class="display-4 pt-3">Display 4</h1>
                                <hr class="my-0" />
                                <h1 class="display-5 pt-3">Display 5</h1>
                                <hr class="my-0" />
                                <h1 class="display-6 pt-3 mb-0">Display 6</h1>
                            </div>
                            <div class="tab-pane fade" id="html2" role="tabpanel">
                                <pre class="line-numbers"><code class="lang-html">&lt;!-- Display headings --&gt;
&lt;h1 class=&quot;display-1&quot;&gt;Display 1&lt;/h1&gt;
&lt;h1 class=&quot;display-2&quot;&gt;Display 2&lt;/h1&gt;
&lt;h1 class=&quot;display-3&quot;&gt;Display 3&lt;/h1&gt;
&lt;h1 class=&quot;display-4&quot;&gt;Display 4&lt;/h1&gt;
&lt;h1 class=&quot;display-5&quot;&gt;Display 5&lt;/h1&gt;
&lt;h1 class=&quot;display-6&quot;&gt;Display 6&lt;/h1&gt;</code></pre>
                            </div>
                        </div>
                    </section>

                    <!-- Body text sizes -->
                    <section id="type-body-text" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                        <h2 class="h4">Body text sizes</h2>
                        <div class="d-table">
                            <ul class="nav nav-tabs-alt" role="tablist">
                                <li class="nav-item">
                                    <a
                                        class="nav-link active"
                                        href="#preview3"
                                        data-bs-toggle="tab"
                                        role="tab"
                                        aria-controls="preview3"
                                        aria-selected="true"
                                    >
                                        <i class="bx bx-show-alt fs-base opacity-70 me-2"></i>
                                        Preview
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a
                                        class="nav-link"
                                        href="#html3"
                                        data-bs-toggle="tab"
                                        role="tab"
                                        aria-controls="html3"
                                        aria-selected="false"
                                    >
                                        <i class="bx bx-code-alt fs-base opacity-70 me-2"></i>
                                        HTML
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div class="tab-content pt-1">
                            <div class="tab-pane fade show active" id="preview3" role="tabpanel">
                                <p class="fs-1">
                                    <span class="fw-bold">fs-1.&nbsp;</span>Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor
                                    auctor
                                </p>
                                <p class="fs-2">
                                    <span class="fw-bold">fs-2.&nbsp;</span>Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor
                                    auctor
                                </p>
                                <p class="fs-3">
                                    <span class="fw-bold">fs-3.&nbsp;</span>Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor
                                    auctor
                                </p>
                                <p class="fs-4">
                                    <span class="fw-bold">fs-4.&nbsp;</span>Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor
                                    auctor
                                </p>
                                <p class="fs-5">
                                    <span class="fw-bold">fs-5.&nbsp;</span>Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor
                                    auctor
                                </p>
                                <p class="fs-6">
                                    <span class="fw-bold">fs-6.&nbsp;</span>Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor
                                    auctor
                                </p>
                                <p class="lead">
                                    <span class="fw-bold">Lead.&nbsp;</span>Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor
                                    auctor
                                </p>
                                <p class="fs-lg">
                                    <strong>Large.&nbsp;</strong>Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor
                                </p>
                                <p><strong>Normal.&nbsp;</strong>Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor</p>
                                <p class="fs-sm">
                                    <strong>Small.&nbsp;</strong>Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor
                                </p>
                                <p class="fs-xs mb-md-0">
                                    <strong>Extra small.&nbsp;</strong>Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor
                                </p>
                            </div>
                            <div class="tab-pane fade" id="html3" role="tabpanel">
                                <pre class="line-numbers d-flex"><code class="lang-html">&lt;!-- Body text sizes --&gt;
&lt;p class=&quot;fs-1&quot;&gt;Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor&lt;/p&gt;
&lt;p class=&quot;fs-2&quot;&gt;Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor&lt;/p&gt;
&lt;p class=&quot;fs-3&quot;&gt;Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor&lt;/p&gt;
&lt;p class=&quot;fs-4&quot;&gt;Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor&lt;/p&gt;
&lt;p class=&quot;fs-5&quot;&gt;Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor&lt;/p&gt;
&lt;p class=&quot;fs-6&quot;&gt;Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor&lt;/p&gt;
&lt;p class=&quot;lead&quot;&gt;Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor&lt;/p&gt;
&lt;p class=&quot;fs-lg&quot;&gt;Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor&lt;/p&gt;
&lt;p&gt;Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor&lt;/p&gt;
&lt;p class=&quot;fs-sm&quot;&gt;Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor&lt;/p&gt;
&lt;p class=&quot;fs-xs&quot;&gt;Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor&lt;/p&gt;</code></pre>
                            </div>
                        </div>
                    </section>

                    <!-- Inline text elements -->
                    <section id="type-inline" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                        <h2 class="h4">Inline text elements</h2>
                        <div class="d-table">
                            <ul class="nav nav-tabs-alt" role="tablist">
                                <li class="nav-item">
                                    <a
                                        class="nav-link active"
                                        href="#preview4"
                                        data-bs-toggle="tab"
                                        role="tab"
                                        aria-controls="preview4"
                                        aria-selected="true"
                                    >
                                        <i class="bx bx-show-alt fs-base opacity-70 me-2"></i>
                                        Preview
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a
                                        class="nav-link"
                                        href="#html4"
                                        data-bs-toggle="tab"
                                        role="tab"
                                        aria-controls="html4"
                                        aria-selected="false"
                                    >
                                        <i class="bx bx-code-alt fs-base opacity-70 me-2"></i>
                                        HTML
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div class="tab-content pt-1">
                            <div class="tab-pane fade show active" id="preview4" role="tabpanel">
                                <p>You can use the mark tag to <mark>highlight</mark> text.</p>
                                <p>
                                    <del>This line of text is meant to be treated as deleted text.</del>
                                </p>
                                <p>
                                    <s>This line of text is meant to be treated as no longer accurate.</s>
                                </p>
                                <p><ins>This line of text is meant to be treated as an addition to the document.</ins></p>
                                <p>
                                    <u>This line of text will render as underlined.</u>
                                </p>
                                <p><small>This line of text is meant to be treated as fine print.</small></p>
                                <p><strong>This line rendered as bold text.</strong></p>
                                <p><em>This line rendered as italicized text.</em></p>
                                <p class="mb-0"><a href="#">Inline link</a></p>
                            </div>
                            <div class="tab-pane fade" id="html4" role="tabpanel">
                                <pre class="line-numbers"><code class="lang-html">&lt;!-- Inline text elements --&gt;
&lt;p&gt;You can use the mark tag to &lt;mark&gt;highlight&lt;/mark&gt; text.&lt;/p&gt;
&lt;p&gt;&lt;del&gt;This line of text is meant to be treated as deleted text.&lt;/del&gt;&lt;/p&gt;
&lt;p&gt;&lt;s&gt;This line of text is meant to be treated as no longer accurate.&lt;/s&gt;&lt;/p&gt;
&lt;p&gt;&lt;ins&gt;This line of text is meant to be treated as an addition to the document.&lt;/ins&gt;&lt;/p&gt;
&lt;p&gt;&lt;u&gt;This line of text will render as underlined.&lt;/u&gt;&lt;/p&gt;
&lt;p&gt;&lt;small&gt;This line of text is meant to be treated as fine print.&lt;/small&gt;&lt;/p&gt;
&lt;p&gt;&lt;strong&gt;This line rendered as bold text.&lt;/strong&gt;&lt;/p&gt;
&lt;p&gt;&lt;em&gt;This line rendered as italicized text.&lt;/em&gt;&lt;/p&gt;
&lt;p&gt;&lt;a href=&quot;#&quot;&gt;Inline link&lt;/a&gt;&lt;/p&gt;</code></pre>
                            </div>
                        </div>
                    </section>

                    <!-- Abbreviations -->
                    <section id="type-abbreviations" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                        <h2 class="h4">Abbreviations</h2>
                        <div class="d-table">
                            <ul class="nav nav-tabs-alt" role="tablist">
                                <li class="nav-item">
                                    <a
                                        class="nav-link active"
                                        href="#preview5"
                                        data-bs-toggle="tab"
                                        role="tab"
                                        aria-controls="preview5"
                                        aria-selected="true"
                                    >
                                        <i class="bx bx-show-alt fs-base opacity-70 me-2"></i>
                                        Preview
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a
                                        class="nav-link"
                                        href="#html5"
                                        data-bs-toggle="tab"
                                        role="tab"
                                        aria-controls="html5"
                                        aria-selected="false"
                                    >
                                        <i class="bx bx-code-alt fs-base opacity-70 me-2"></i>
                                        HTML
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div class="tab-content pt-1">
                            <div class="tab-pane fade show active" id="preview5" role="tabpanel">
                                <p><abbr title="attribute">attr</abbr></p>
                                <p class="mb-0"><abbr class="initialism" title="HyperText Markup Language">HTML</abbr></p>
                            </div>
                            <div class="tab-pane fade" id="html5" role="tabpanel">
                                <pre class="line-numbers"><code class="lang-html">&lt;!-- Abbreviations --&gt;
&lt;p&gt;&lt;abbr title=&quot;attribute&quot;&gt;attr&lt;/abbr&gt;&lt;/p&gt;
&lt;p&gt;&lt;abbr class=&quot;initialism&quot; title=&quot;HyperText Markup Language&quot;&gt;HTML&lt;/abbr&gt;&lt;/p&gt;</code></pre>
                            </div>
                        </div>
                    </section>

                    <!-- Blockquote -->
                    <section id="type-blockquote" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                        <h2 class="h4">Blockquote</h2>
                        <div class="d-table">
                            <ul class="nav nav-tabs-alt" role="tablist">
                                <li class="nav-item">
                                    <a
                                        class="nav-link active"
                                        href="#preview6"
                                        data-bs-toggle="tab"
                                        role="tab"
                                        aria-controls="preview6"
                                        aria-selected="true"
                                    >
                                        <i class="bx bx-show-alt fs-base opacity-70 me-2"></i>
                                        Preview
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a
                                        class="nav-link"
                                        href="#html6"
                                        data-bs-toggle="tab"
                                        role="tab"
                                        aria-controls="html6"
                                        aria-selected="false"
                                    >
                                        <i class="bx bx-code-alt fs-base opacity-70 me-2"></i>
                                        HTML
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div class="tab-content pt-1">
                            <div class="tab-pane fade show active" id="preview6" role="tabpanel">
                                <figure class="mb-0">
                                    <blockquote class="blockquote">
                                        <p>A well-known quote, contained in a blockquote element.</p>
                                    </blockquote>
                                    <figcaption class="blockquote-footer mb-0">
                                        Someone famous in <cite title="Source Title">Source Title</cite>
                                    </figcaption>
                                </figure>
                            </div>
                            <div class="tab-pane fade" id="html6" role="tabpanel">
                                <pre class="line-numbers"><code class="lang-html">&lt;!-- Blockquote --&gt;
&lt;figure&gt;
  &lt;blockquote class=&quot;blockquote&quot;&gt;
    &lt;p&gt;A well-known quote, contained in a blockquote element.&lt;/p&gt;
  &lt;/blockquote&gt;
  &lt;figcaption class=&quot;blockquote-footer&quot;&gt;
    Someone famous in &lt;cite title=&quot;Source Title&quot;&gt;Source Title&lt;/cite&gt;
  &lt;/figcaption&gt;
&lt;/figure&gt;</code></pre>
                            </div>
                        </div>
                    </section>

                    <!-- Lists: Unordered and ordered -->
                    <section id="type-lists" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                        <h2 class="h4">Lists: Unordered and ordered</h2>
                        <div class="d-table">
                            <ul class="nav nav-tabs-alt" role="tablist">
                                <li class="nav-item">
                                    <a
                                        class="nav-link active"
                                        href="#preview7"
                                        data-bs-toggle="tab"
                                        role="tab"
                                        aria-controls="preview7"
                                        aria-selected="true"
                                    >
                                        <i class="bx bx-show-alt fs-base opacity-70 me-2"></i>
                                        Preview
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a
                                        class="nav-link"
                                        href="#html7"
                                        data-bs-toggle="tab"
                                        role="tab"
                                        aria-controls="html7"
                                        aria-selected="false"
                                    >
                                        <i class="bx bx-code-alt fs-base opacity-70 me-2"></i>
                                        HTML
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div class="tab-content pt-1">
                            <div class="tab-pane fade show active" id="preview7" role="tabpanel">
                                <div class="row">
                                    <div class="col-sm-6">
                                        <ul class="mb-sm-0">
                                            <li>Lorem ipsum dolor sit amet</li>
                                            <li>Consectetur adipiscing elit</li>
                                            <li>Integer molestie lorem at massa</li>
                                            <li>Facilisis in pretium nisl aliquet</li>
                                            <li>Nulla volutpat aliquam velit</li>
                                        </ul>
                                    </div>
                                    <div class="col-sm-6">
                                        <ol class="mb-0">
                                            <li>Lorem ipsum dolor sit amet</li>
                                            <li>Consectetur adipiscing elit</li>
                                            <li>Integer molestie lorem at massa</li>
                                            <li>Facilisis in pretium nisl aliquet</li>
                                            <li>Nulla volutpat aliquam velit</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="html7" role="tabpanel">
                                <pre class="line-numbers"><code class="lang-html">&lt;!-- Unordered list --&gt;
&lt;ul&gt;
  &lt;li&gt;Lorem ipsum dolor sit amet&lt;/li&gt;
  &lt;li&gt;Consectetur adipiscing elit&lt;/li&gt;
  &lt;li&gt;Integer molestie lorem at massa&lt;/li&gt;
  &lt;li&gt;Facilisis in pretium nisl aliquet&lt;/li&gt;
  &lt;li&gt;Nulla volutpat aliquam velit&lt;/li&gt;
&lt;/ul&gt;

&lt;!-- Ordered list --&gt;
&lt;ol&gt;
  &lt;li&gt;Lorem ipsum dolor sit amet&lt;/li&gt;
  &lt;li&gt;Consectetur adipiscing elit&lt;/li&gt;
  &lt;li&gt;Integer molestie lorem at massa&lt;/li&gt;
  &lt;li&gt;Facilisis in pretium nisl aliquet&lt;/li&gt;
  &lt;li&gt;Nulla volutpat aliquam velit&lt;/li&gt;
&lt;/ol&gt;</code></pre>
                            </div>
                        </div>
                    </section>

                    <!-- Lists: Unstyled -->
                    <section id="type-lists-unstyled" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                        <h2 class="h4">Lists: Unstyled</h2>
                        <div class="d-table">
                            <ul class="nav nav-tabs-alt" role="tablist">
                                <li class="nav-item">
                                    <a
                                        class="nav-link active"
                                        href="#preview8"
                                        data-bs-toggle="tab"
                                        role="tab"
                                        aria-controls="preview8"
                                        aria-selected="true"
                                    >
                                        <i class="bx bx-show-alt fs-base opacity-70 me-2"></i>
                                        Preview
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a
                                        class="nav-link"
                                        href="#html8"
                                        data-bs-toggle="tab"
                                        role="tab"
                                        aria-controls="html8"
                                        aria-selected="false"
                                    >
                                        <i class="bx bx-code-alt fs-base opacity-70 me-2"></i>
                                        HTML
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div class="tab-content pt-1">
                            <div class="tab-pane fade show active" id="preview8" role="tabpanel">
                                <ul class="list-unstyled mb-0">
                                    <li>Lorem ipsum dolor sit amet</li>
                                    <li>Consectetur adipiscing elit</li>
                                    <li>
                                        Integer molestie lorem at massa
                                        <ul>
                                            <li>Phasellus iaculis neque</li>
                                            <li>Purus sodales ultricies</li>
                                            <li>Vestibulum laoreet porttitor sem</li>
                                        </ul>
                                    </li>
                                    <li>Faucibus porta lacus fringilla vel</li>
                                    <li>Aenean sit amet erat nunc</li>
                                </ul>
                            </div>
                            <div class="tab-pane fade" id="html8" role="tabpanel">
                                <pre class="line-numbers"><code class="lang-html">&lt;!-- Unstyled list --&gt;
&lt;ul class=&quot;list-unstyled&quot;&gt;
  &lt;li&gt;Lorem ipsum dolor sit amet&lt;/li&gt;
  &lt;li&gt;Consectetur adipiscing elit&lt;/li&gt;
  &lt;li&gt;Integer molestie lorem at massa&lt;/li&gt;
    &lt;ul&gt;
      &lt;li&gt;Phasellus iaculis neque&lt;/li&gt;
      &lt;li&gt;Purus sodales ultricies&lt;/li&gt;
      &lt;li&gt;Vestibulum laoreet porttitor sem&lt;/li&gt;
    &lt;/ul&gt;
  &lt;/li&gt;
  &lt;li&gt;Faucibus porta lacus fringilla vel&lt;/li&gt;
  &lt;li&gt;Aenean sit amet erat nunc&lt;/li&gt;
&lt;/ul&gt;</code></pre>
                            </div>
                        </div>
                    </section>

                    <!-- Lists: Inline -->
                    <section id="type-lists-inline" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                        <h2 class="h4">Lists: Inline</h2>
                        <div class="d-table">
                            <ul class="nav nav-tabs-alt" role="tablist">
                                <li class="nav-item">
                                    <a
                                        class="nav-link active"
                                        href="#preview9"
                                        data-bs-toggle="tab"
                                        role="tab"
                                        aria-controls="preview9"
                                        aria-selected="true"
                                    >
                                        <i class="bx bx-show-alt fs-base opacity-70 me-2"></i>
                                        Preview
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a
                                        class="nav-link"
                                        href="#html9"
                                        data-bs-toggle="tab"
                                        role="tab"
                                        aria-controls="html9"
                                        aria-selected="false"
                                    >
                                        <i class="bx bx-code-alt fs-base opacity-70 me-2"></i>
                                        HTML
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div class="tab-content pt-1">
                            <div class="tab-pane fade show active" id="preview9" role="tabpanel">
                                <ul class="list-inline mb-0">
                                    <li class="list-inline-item">Lorem ipsum dolor</li>
                                    <li class="list-inline-item">Consectetur adipiscing</li>
                                    <li class="list-inline-item">Integer molestie</li>
                                </ul>
                            </div>
                            <div class="tab-pane fade" id="html9" role="tabpanel">
                                <pre class="line-numbers"><code class="lang-html">&lt;!-- Inline list --&gt;
&lt;ul class=&quot;list-inline&quot;&gt;
  &lt;li class=&quot;list-inline-item&quot;&gt;Lorem ipsum dolor&lt;/li&gt;
  &lt;li class=&quot;list-inline-item&quot;&gt;Consectetur adipiscing&lt;/li&gt;
  &lt;li class=&quot;list-inline-item&quot;&gt;Integer molestie&lt;/li&gt;
&lt;/ul&gt;</code></pre>
                            </div>
                        </div>
                    </section>

                    <!-- Description list basic example -->
                    <section id="type-description-list" class="border-bottom py-5 ps-lg-2 ps-xxl-0">
                        <h2 class="h4">Description list basic example</h2>
                        <div class="d-table">
                            <ul class="nav nav-tabs-alt" role="tablist">
                                <li class="nav-item">
                                    <a
                                        class="nav-link active"
                                        href="#preview10"
                                        data-bs-toggle="tab"
                                        role="tab"
                                        aria-controls="preview10"
                                        aria-selected="true"
                                    >
                                        <i class="bx bx-show-alt fs-base opacity-70 me-2"></i>
                                        Preview
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a
                                        class="nav-link"
                                        href="#html10"
                                        data-bs-toggle="tab"
                                        role="tab"
                                        aria-controls="html10"
                                        aria-selected="false"
                                    >
                                        <i class="bx bx-code-alt fs-base opacity-70 me-2"></i>
                                        HTML
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div class="tab-content pt-1">
                            <div class="tab-pane fade show active" id="preview10" role="tabpanel">
                                <dl class="mb-0">
                                    <dt>Description lists</dt>
                                    <dd>A description list is perfect for defining terms.</dd>
                                    <dt>Malesuada porta</dt>
                                    <dd>Etiam porta sem malesuada magna mollis euismod.</dd>
                                    <dt>Euismod</dt>
                                    <dd>Vestibulum id ligula porta felis euismod semper eget lacinia odio sem nec elit.</dd>
                                </dl>
                            </div>
                            <div class="tab-pane fade" id="html10" role="tabpanel">
                                <pre class="line-numbers"><code class="lang-html">&lt;!-- Description list basic example --&gt;
&lt;dl&gt;
  &lt;dt&gt;Description lists&lt;/dt&gt;
  &lt;dd&gt;A description list is perfect for defining terms.&lt;/dd&gt;
  &lt;dt&gt;Malesuada porta&lt;/dt&gt;
  &lt;dd&gt;Etiam porta sem malesuada magna mollis euismod.&lt;/dd&gt;
  &lt;dt&gt;Euismod&lt;/dt&gt;
  &lt;dd&gt;Vestibulum id ligula porta felis euismod semper eget lacinia odio sem nec elit.&lt;/dd&gt;
&lt;/dl&gt;</code></pre>
                            </div>
                        </div>
                    </section>

                    <!-- Description list alignment -->
                    <section id="type-description-list-align" class="py-5 ps-lg-2 ps-xxl-0">
                        <h2 class="h4">Description list alignment</h2>
                        <div class="d-table">
                            <ul class="nav nav-tabs-alt" role="tablist">
                                <li class="nav-item">
                                    <a
                                        class="nav-link active"
                                        href="#preview11"
                                        data-bs-toggle="tab"
                                        role="tab"
                                        aria-controls="preview11"
                                        aria-selected="true"
                                    >
                                        <i class="bx bx-show-alt fs-base opacity-70 me-2"></i>
                                        Preview
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a
                                        class="nav-link"
                                        href="#html11"
                                        data-bs-toggle="tab"
                                        role="tab"
                                        aria-controls="html11"
                                        aria-selected="false"
                                    >
                                        <i class="bx bx-code-alt fs-base opacity-70 me-2"></i>
                                        HTML
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div class="tab-content pt-1">
                            <div class="tab-pane fade show active" id="preview11" role="tabpanel">
                                <dl class="row mb-0">
                                    <dt class="col-sm-3">Description lists</dt>
                                    <dd class="col-sm-9">A description list is perfect for defining terms.</dd>
                                    <dt class="col-sm-3">Euismod</dt>
                                    <dd class="col-sm-9">
                                        <p class="mb-2">Vestibulum id ligula porta felis euismod semper eget lacinia odio sem nec elit.</p>
                                        <p class="mb-0">Donec id elit non mi porta gravida at eget metus.</p>
                                    </dd>
                                    <dt class="col-sm-3">Malesuada porta</dt>
                                    <dd class="col-sm-9">Etiam porta sem malesuada magna mollis euismod.</dd>
                                    <dt class="col-sm-3 text-truncate">Long truncated term is truncated</dt>
                                    <dd class="col-sm-9">
                                        Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo
                                        sit amet risus.
                                    </dd>
                                    <dt class="col-sm-3">Nesting</dt>
                                    <dd class="col-sm-9">
                                        <dl class="row mb-0">
                                            <dt class="col-sm-4">Nested definition list</dt>
                                            <dd class="col-sm-8">Aenean posuere, tortor sed cursus feugiat nunc augue.</dd>
                                        </dl>
                                    </dd>
                                </dl>
                            </div>
                            <div class="tab-pane fade" id="html11" role="tabpanel">
                                <pre class="line-numbers"><code class="lang-html">&lt;!-- Description list alignment --&gt;
&lt;dl class=&quot;row&quot;&gt;
  &lt;dt class=&quot;col-sm-3&quot;&gt;Description lists&amp;nbsp;&lt;/dt&gt;
  &lt;dd class=&quot;col-sm-9&quot;&gt;A description list is perfect for defining terms.&lt;/dd&gt;
  &lt;dt class=&quot;col-sm-3&quot;&gt;Euismod&lt;/dt&gt;
  &lt;dd class=&quot;col-sm-9&quot;&gt;
    &lt;p class=&quot;mb-2&quot;&gt;Vestibulum id ligula porta felis euismod semper eget lacinia odio sem nec elit.&lt;/p&gt;
    &lt;p class=&quot;mb-0&quot;&gt;Donec id elit non mi porta gravida at eget metus.&lt;/p&gt;
  &lt;/dd&gt;
  &lt;dt class=&quot;col-sm-3&quot;&gt;Malesuada porta&lt;/dt&gt;
  &lt;dd class=&quot;col-sm-9&quot;&gt;Etiam porta sem malesuada magna mollis euismod.&lt;/dd&gt;
  &lt;dt class=&quot;col-sm-3 text-truncate&quot;&gt;Long truncated term is truncated&lt;/dt&gt;
  &lt;dd class=&quot;col-sm-9&quot;&gt;Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.&lt;/dd&gt;
  &lt;dt class=&quot;col-sm-3&quot;&gt;Nesting&lt;/dt&gt;
  &lt;dd class=&quot;col-sm-9&quot;&gt;
    &lt;dl class=&quot;row&quot;&gt;
      &lt;dt class=&quot;col-sm-4&quot;&gt;Nested definition list&lt;/dt&gt;
      &lt;dd class=&quot;col-sm-8&quot;&gt;Aenean posuere, tortor sed cursus feugiat nunc augue.&lt;/dd&gt;
    &lt;/dl&gt;
  &lt;/dd&gt;
&lt;/dl&gt;</code></pre>
                            </div>
                        </div>
                    </section>
                </div>
            `;
        };
        this.rightBar = () => {
            return ` <!-- Jump to anchor navigation -->
                <aside
                    id="jumpToNav"
                    class="side-nav side-nav-end d-none d-xxl-block position-fixed top-0 end-0 vh-100 py-5"
                    style="width: 20rem;"
                >
                    <h3 class="fs-lg mt-5 pt-5">Jump to</h3>
                    <ul class="nav">
                        <li class="nav-item">
                            <a href="#type-headings" class="nav-link" data-scroll data-scroll-offset="-6">Headings</a>
                        </li>
                        <li class="nav-item">
                            <a href="#type-displays" class="nav-link" data-scroll data-scroll-offset="-6">Display headings</a>
                        </li>
                        <li class="nav-item">
                            <a href="#type-body-text" class="nav-link" data-scroll data-scroll-offset="-6">Body text sizes</a>
                        </li>
                        <li class="nav-item">
                            <a href="#type-inline" class="nav-link" data-scroll data-scroll-offset="-6">Inline text elements</a>
                        </li>
                        <li class="nav-item">
                            <a href="#type-abbreviations" class="nav-link" data-scroll data-scroll-offset="-6">Abbreviations</a>
                        </li>
                        <li class="nav-item">
                            <a href="#type-blockquote" class="nav-link" data-scroll data-scroll-offset="-6">Blockquote</a>
                        </li>
                        <li class="nav-item">
                            <a href="#type-lists" class="nav-link" data-scroll data-scroll-offset="-6">Lists: Unordered and ordered</a>
                        </li>
                        <li class="nav-item">
                            <a href="#type-lists-unstyled" class="nav-link" data-scroll data-scroll-offset="-6">Lists: Unstyled</a>
                        </li>
                        <li class="nav-item">
                            <a href="#type-lists-inline" class="nav-link" data-scroll data-scroll-offset="-6">Lists: Inline</a>
                        </li>
                        <li class="nav-item">
                            <a href="#type-description-list" class="nav-link" data-scroll data-scroll-offset="-6"
                                >Description list basic example</a
                            >
                        </li>
                        <li class="nav-item">
                            <a href="#type-description-list-align" class="nav-link" data-scroll data-scroll-offset="-6"
                                >Description list alignment</a
                            >
                        </li>
                    </ul>
                </aside>`;
        };
    }
}
