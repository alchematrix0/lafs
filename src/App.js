import React, { Component } from 'react';
import './App.css';
import { Columns, Hero, Card, Media, Content, Section, Navbar, Heading, Breadcrumb, Tag, Label, Form, Button, Container } from 'react-bulma-components/full';
const data = require("./data.json");
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      keywords: [],
      category: [],
      subcategory: [],
      commodity: [],
      searchInput: '',
      categories: [],
      subcategories: [],
      commodities: [],
      resources: []
    }
  }
  applyFilters = (resources) => resources.reduce((ar, resource) => {
    if (
      (!this.state.category.length && !this.state.commodity.length && !this.state.subcategory.length && !this.state.searchInput.length) ||
      (this.state.category.find(c => c === resource.category) || this.state.subcategory.find(c => c === resource.subcategory)) ||
      this.state.commodity.find(c => c === resource.commodity) ||
      (this.state.searchInput.length && resource.keys.split(',').map(t => t.trim()).some(k => k.toLowerCase().includes(this.state.searchInput)))
    ) {
      ar.push(resource)
      return ar
    } else return ar
  }, [])
  handleFilter = () => {
    this.setState(() => {return {resources: this.applyFilters(data)}})
  }
  handleSearchInput = (e) => {
    this.setState({searchInput: e.target.value})
  }
  toggleCategory = (e) => this.setState({ category: e.target.checked ? this.state.category.concat([e.target.name]) : this.state.category.filter(v => v !== e.target.name) }, this.handleFilter())
  toggleSubcategory = (e) => this.setState({ subcategory: e.target.checked ? this.state.subcategory.concat([e.target.name]) : this.state.subcategory.filter(v => v !== e.target.name) }, this.handleFilter())
  toggleCommodity = (e) => this.setState({ commodity: e.target.checked ? this.state.commodity.concat([e.target.name]) : this.state.commodity.filter(v => v !== e.target.name) }, this.handleFilter())
  componentWillMount () {
    this.setState({
      categories: Array.from(new Set(data.map(resource => resource.category))),
      subcategories: Array.from(new Set(data.map(resource => resource.subcategory))),
      commodities: Array.from(new Set(data.map(resource => resource.commodity))),
      resources: data
    })
  }

  renderResources = () => {
    return this.applyFilters(data).map(resource => {
      return (
        <Columns.Column size={6} key={resource.web_link}>
          <Card>
            <Card.Image size="4by3" src={resource.img} />
            <Card.Content>
              <Media>
                <Media.Item>
                  <Heading style={{color: 'black'}} size={4}>
                    <a href={resource.web_link} target='_blank'>{resource.resource}</a>
                  </Heading>
                  <Heading subtitle style={{color: 'black'}} size={6}>
                    {resource.organization}
                  </Heading>
                </Media.Item>
              </Media>
              <Breadcrumb style={{marginBottom: '-1em'}} items={[{name: resource.category, url: 'some-link', key : 1}, {name: resource.subcategory, url: '', key : 2}]} />
              <Content>
                <br />
                {resource.keys.split(',').map((t, i) => {let tag = t.trim(); return (
                  <Tag key={`${i}${Math.random()}`}>
                    {tag}
                  </Tag>
                )})}
                <br/>
              </Content>
            </Card.Content>
          </Card>
        </Columns.Column>
      )
    })
  }
  render() {
    return (
        <Hero color="info" size="fullheight">
          <Hero.Head renderAs="header">
            <Navbar fixed='top' color='white'>
              <Navbar.Brand>
                <Navbar.Item href="#" renderAs='header'>
                  Farmer Resource Database
                </Navbar.Item>
                <Navbar.Burger/>
              </Navbar.Brand>
            </Navbar>
          </Hero.Head>
          <Hero.Body>
            <Container>
              <Columns>
                <Columns.Column size={8}>
                  <Columns>
                    {this.renderResources()}
                  </Columns>
                </Columns.Column>
                <Columns.Column className='filters' style={{marginTop: '0.5em', position: 'fixed', right: '2em', maxWidth: '100%'}} size={4}>
                  <Form.Control style={{marginBottom: '1em'}}>
                    <Form.Input placeholder="search anything" value={this.state.searchInput} onChange={this.handleSearchInput}></Form.Input>
                  </Form.Control>
                  <Form.Control style={{marginBottom: '0.5em'}}><Heading>Category</Heading></Form.Control>
                  {this.state.categories.map((c, i) => (
                    <Form.Control fullwidth size='medium' key={i}>
                      <Form.Checkbox name={c} onClick={this.toggleCategory}>{c}</Form.Checkbox>
                    </Form.Control>))}
                  <hr />
                  <Form.Control style={{marginBottom: '0.5em'}}><Heading>Subcategory</Heading></Form.Control>
                  {this.state.subcategories.map((c, i) => (
                    <Form.Control fullwidth size='medium' key={i}>
                      <Form.Checkbox name={c} onClick={this.toggleSubcategory}>{c}</Form.Checkbox>
                    </Form.Control>))}
                  <hr />
                  <Form.Control style={{marginBottom: '0.5em'}}><Heading>Commodity</Heading></Form.Control>
                  {this.state.commodities.map((c, i) => (
                    <Form.Control fullwidth size='medium' key={i}>
                      <Form.Checkbox name={c} onClick={this.toggleCommodity}>{c}</Form.Checkbox>
                    </Form.Control>))}
                </Columns.Column>
              </Columns>
            </Container>
          </Hero.Body>
        </Hero>
              );
  }
}

export default App;
