import {
  generateCommentsListEmptyTemplate,
  generateCommentsListErrorTemplate,
  generateLoaderAbsoluteTemplate,
  generateReportCommentItemTemplate,
  generateReportDetailErrorTemplate,
  generateReportDetailTemplate,
  generateSaveReportButtonTemplate,
  generateRemoveReportButtonTemplate
} from '../../../templates';
import { createCarousel } from '../../../utils';
import ReportDetailPresenter from './report-detail-presenter';
import { parseActivePathname } from '../../../routes/url-parser';
import Map from '../../../utils/map';
import * as StoryAPI from '../../../data/api';
import Database from '../../../data/database';

export default class ReportDetailPage {
  #presenter = null;
  #form = null;
  #map = null;

  async render() {
    return `
      <section>
        <div class="report-detail__container">
          <div id="report-detail" class="report-detail"></div>
          <div id="report-detail-loading-container"></div>
        </div>
      </section>
      
      
    `;
  }

  async afterRender() {
    this.#presenter = new ReportDetailPresenter(parseActivePathname().id, {
      view: this,
      apiModel: StoryAPI,
      dbModel: Database,
    });
    

    this.#presenter.showReportDetail();
  }

  async populateReportDetailAndInitialMap(message, report) {
  document.getElementById('report-detail').innerHTML = generateReportDetailTemplate({
    description: report.description,
    evidenceImages: report.photoUrl,
    location: report.location,
    reporterName: report.name,
    createdAt: report.createdAt,
  });

  this.renderSaveButton();

  // Carousel images
  createCarousel(document.getElementById('images'));

  // Map
  await this.#presenter.showReportDetailMap();
  
  if (this.#map && report.lat != null && report.lon != null) {
    const reportCoordinate = [report.lat, report.lon];
    const markerOptions = { alt: report.name };
    const popupOptions = { content: report.name };

    this.#map.changeCamera(reportCoordinate);
    this.#map.addMarker(reportCoordinate, markerOptions, popupOptions);
  } else {
    console.warn('Lokasi tidak tersedia, tidak menampilkan peta.');
  }
}

  populateReportDetailError(message) {
    document.getElementById('report-detail').innerHTML = generateReportDetailErrorTemplate(message);
  }

  populateReportDetailComments(message, comments) {
    if (comments.length <= 0) {
      this.populateCommentsListEmpty();
      return;
    }

    const html = comments.reduce(
      (accumulator, comment) =>
        accumulator.concat(
          generateReportCommentItemTemplate({
            photoUrlCommenter: comment.commenter.photoUrl,
            nameCommenter: comment.commenter.name,
            body: comment.body,
          }),
        ),
      '',
    );

    document.getElementById('report-detail-comments-list').innerHTML = `
      <div class="report-detail__comments-list">${html}</div>
    `;
  }

  populateCommentsListEmpty() {
    document.getElementById('report-detail-comments-list').innerHTML =
      generateCommentsListEmptyTemplate();
  }

  populateCommentsListError(message) {
    document.getElementById('report-detail-comments-list').innerHTML =
      generateCommentsListErrorTemplate(message);
  }

  async initialMap() {
    this.#map = await Map.build('#map', {
      zoom: 15,
    });
  }

  

  postNewCommentSuccessfully(message) {
    console.log(message);

    this.#presenter.getCommentsList();
    this.clearForm();
  }

  postNewCommentFailed(message) {
    alert(message);
  }

  clearForm() {
    this.#form.reset();
  }

  renderSaveButton() {
    document.getElementById('save-actions-container').innerHTML =
      generateSaveReportButtonTemplate();

    document.getElementById('report-detail-save').addEventListener('click', async () => {
      await this.#presenter.saveReport();
      await this.#presenter.showSaveButton();
    });
  }

  saveToBookmarkSuccessfully(message) {
    console.log(message);
  }
  saveToBookmarkFailed(message) {
    alert(message);
  }

  renderRemoveButton() {
    document.getElementById('save-actions-container').innerHTML =
      generateRemoveReportButtonTemplate();

    document.getElementById('report-detail-remove').addEventListener('click', async () => {
      await this.#presenter.removeReport();
      await this.#presenter.showSaveButton();
    });
  }

  removeFromBookmarkSuccessfully(message) {
    console.log(message);
  }
  removeFromBookmarkFailed(message) {
    alert(message);
  }

  showReportDetailLoading() {
    document.getElementById('report-detail-loading-container').innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideReportDetailLoading() {
    document.getElementById('report-detail-loading-container').innerHTML = '';
  }

  showMapLoading() {
    document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }

  showCommentsLoading() {
    document.getElementById('comments-list-loading-container').innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideCommentsLoading() {
    document.getElementById('comments-list-loading-container').innerHTML = '';
  }

  showSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn" type="submit" disabled>
        <i class="fas fa-spinner loader-button"></i> Tanggapi
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn" type="submit">Tanggapi</button>
    `;
  }
}
